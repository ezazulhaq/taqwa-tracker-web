import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthSession, LoginCredentials, UserMetaData, RegisterCredentials, User, ApiUser, LoginResponse, SessionInfo, UserPreferences } from '../model/auth.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { RateLimitService } from './rate-limit.service';
import { SanitizationService } from './sanitization.service';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private rateLimitService = inject(RateLimitService);
  private sanitizationService = inject(SanitizationService);
  private authTokenService = inject(AuthTokenService);
  private initializationPromise: Promise<void>;
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private refreshTimer: any = null;
  private isRefreshing = false;

  // Delegate signals to authTokenService
  currentUser = this.authTokenService.currentUser;
  userMetaData = this.authTokenService.userMetaData;
  isAuthenticated = this.authTokenService.isAuthenticated;

  constructor() {
    // Initialize and wait for session load
    this.initializationPromise = this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      const token = this.authTokenService.getAccessToken();
      if (token) {
        // Check if token needs refresh
        if (this.authTokenService.shouldRefreshToken()) {
          await this.refreshSession().toPromise();
        } else {
          const user = await this.getCurrentUser().toPromise();
          if (user) {
            this.authTokenService.setUserFromApiResponse(user);
          }
        }
        // Start automatic token refresh timer
        this.startTokenRefreshTimer();
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
      this.authTokenService.clearAuthState();
    }
  }

  private handleAuthError(error: any): Observable<never> {
    console.error('Auth error details:', error);

    // Handle network/CORS errors
    if (error.status === 0) {
      return throwError(() => new Error('Network error: Please check your internet connection or contact support'));
    }

    if (error.message?.includes('captcha')) {
      return throwError(() => new Error('CAPTCHA verification failed. Please refresh and try again.'));
    }
    if (error.message?.includes('Invalid login credentials')) {
      return throwError(() => new Error('Invalid email or password'));
    }
    if (error.message?.includes('Email not confirmed')) {
      return throwError(() => new Error('Please check your email and confirm your account'));
    }
    if (error.message?.includes('Password should be at least')) {
      return throwError(() => new Error('Password must be at least 6 characters long'));
    }
    if (error.message?.includes('User already registered')) {
      return throwError(() => new Error('An account with this email already exists'));
    }
    if (error.message?.includes('Invalid email')) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    // Handle HTTP error responses
    if (error.error?.detail) {
      return throwError(() => new Error(error.error.detail));
    }

    return throwError(() => new Error(error.message || 'An unexpected error occurred'));
  }

  private createAuthSession(tokenResponse: LoginResponse, user: ApiUser): AuthSession {
    if (user) {
      this.authTokenService.setUserFromApiResponse(user);
    }

    // Store tokens
    this.authTokenService.setTokens(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.session_id);

    return {
      user: this.currentUser(),
      metaData: this.userMetaData(),
      accessToken: tokenResponse.access_token || null,
      refreshToken: tokenResponse.refresh_token || null
    };
  }

  login(credentials: LoginCredentials): Observable<AuthSession> {
    const email = this.sanitizationService.sanitizeEmail(credentials.email);

    // Check rate limiting
    if (!this.rateLimitService.canAttempt(email)) {
      const remainingTime = Math.ceil(this.rateLimitService.getRemainingTime(email) / 1000 / 60);
      return throwError(() => new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`));
    }

    // Validate inputs
    if (!this.sanitizationService.validateEmail(email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    const params = new HttpParams()
      .set('email', email)
      .set('password', credentials.password);

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, null, { params }).pipe(
      tap(tokenResponse => {
        this.rateLimitService.recordAttempt(email, true);
        // Store tokens immediately
        this.authTokenService.setTokens(
          tokenResponse.access_token,
          tokenResponse.refresh_token,
          tokenResponse.session_id,
          tokenResponse.expires_in,
          credentials.rememberMe
        );
        // Start automatic token refresh timer
        this.startTokenRefreshTimer();
      }),
      // Switch to get user data
      map(tokenResponse => this.getCurrentUser().pipe(
        map(user => this.createAuthSession(tokenResponse, user))
      )),
      // Flatten the nested observable
      switchMap(sessionObservable => sessionObservable),
      catchError(error => {
        this.rateLimitService.recordAttempt(email, false);
        return this.handleAuthError(error);
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthSession> {
    const email = this.sanitizationService.sanitizeEmail(credentials.email);
    const username = credentials.username ? this.sanitizationService.sanitizeText(credentials.username) : undefined;

    // Validate inputs
    if (!this.sanitizationService.validateEmail(email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    const passwordValidation = this.sanitizationService.validatePassword(credentials.password);
    if (!passwordValidation.valid) {
      return throwError(() => new Error(passwordValidation.errors[0]));
    }

    const registerData = {
      email,
      password: credentials.password,
      full_name: username || email.split('@')[0],
      role: 'user'
    };

    return this.http.post<ApiUser>(`${this.API_BASE_URL}/auth/signup`, registerData).pipe(
      // Registration successful, now login
      switchMap(() => this.login({ email, password: credentials.password })),
      catchError(error => this.handleAuthError(error))
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<{ message: string, email: string }>(`${this.API_BASE_URL}/auth/recover`, { email }).pipe(
      map(() => void 0),
      catchError(error => {
        if (error.message?.includes('Invalid email')) {
          return throwError(() => new Error('Please enter a valid email address'));
        }
        return throwError(() => new Error(error.message || 'Failed to send reset email'));
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_BASE_URL}/auth/reset-password`, {
      token,
      new_password: newPassword
    }).pipe(
      catchError(error => {
        if (error.error?.detail?.includes('Invalid or expired reset token')) {
          return throwError(() => new Error('Reset link has expired or is invalid. Please request a new one.'));
        }
        if (error.message?.includes('Password should be at least')) {
          return throwError(() => new Error('Password must be at least 6 characters long'));
        }
        return throwError(() => new Error(error.message || 'Failed to reset password'));
      })
    );
  }

  updateProfile(updates: { username?: string; full_name?: string }): Observable<UserMetaData> {
    // Sanitize inputs
    const fullName = updates.full_name ? this.sanitizationService.sanitizeText(updates.full_name) :
      updates.username ? this.sanitizationService.sanitizeText(updates.username) : undefined;

    if (!fullName) {
      return throwError(() => new Error('Full name is required'));
    }

    const params = new HttpParams().set('full_name', fullName);

    return this.http.put<ApiUser>(`${this.API_BASE_URL}/user/me`, null, { params }).pipe(
      map(user => {
        // Update local state with new user data
        this.authTokenService.setUserFromApiResponse(user);
        return this.userMetaData()!;
      }),
      catchError(error => {
        if (error.message?.includes('Unauthorized')) {
          return throwError(() => new Error('You must be logged in to update your profile'));
        }
        if (error.message?.includes('Invalid')) {
          return throwError(() => new Error('Invalid profile data provided'));
        }
        return throwError(() => new Error(error.message || 'Failed to update profile'));
      })
    );
  }

  logout(): Observable<void> {
    // Clear refresh timer
    this.clearTokenRefreshTimer();

    return this.http.post<void>(`${this.API_BASE_URL}/auth/logout`, {}).pipe(
      tap(() => {
        this.authTokenService.clearAuthState();
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        // Clear local state even if API call fails
        this.authTokenService.clearAuthState();
        this.router.navigate(['/home']);
        return throwError(() => new Error(error.message || 'Failed to logout'));
      })
    );
  }

  refreshSession(): Observable<AuthSession> {
    const refreshToken = this.authTokenService.getRefreshToken();
    if (!refreshToken) {
      this.authTokenService.clearAuthState();
      return throwError(() => new Error('No refresh token available'));
    }

    // Prevent concurrent refresh attempts
    if (this.isRefreshing) {
      return throwError(() => new Error('Token refresh already in progress'));
    }

    this.isRefreshing = true;

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken }).pipe(
      map(tokenResponse => {
        // Store new tokens with expiration
        this.authTokenService.setTokens(
          tokenResponse.access_token,
          tokenResponse.refresh_token,
          tokenResponse.session_id,
          tokenResponse.expires_in
        );

        // Reschedule next refresh
        this.startTokenRefreshTimer();
        this.isRefreshing = false;

        return {
          user: this.currentUser(),
          metaData: this.userMetaData(),
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || refreshToken
        };
      }),
      catchError(error => {
        // Clear user state on refresh failure
        this.isRefreshing = false;
        this.clearTokenRefreshTimer();
        this.authTokenService.clearAuthState();
        return throwError(() => new Error(error.message || 'Failed to refresh session'));
      })
    );
  }

  // Security methods
  async validateSession(): Promise<boolean> {
    // Ensure initialization is complete before validating
    await this.initializationPromise;

    try {
      const token = this.authTokenService.getAccessToken();
      if (!token) {
        this.authTokenService.clearAuthState();
        return false;
      }

      // Try to get current user to validate token
      const user = await this.getCurrentUser().toPromise();
      return !!user;
    } catch {
      this.authTokenService.clearAuthState();
      return false;
    }
  }

  // Method to ensure auth service is initialized
  async ensureInitialized(): Promise<void> {
    await this.initializationPromise;
  }

  clearAuthState(): void {
    this.authTokenService.clearAuthState();
  }

  getValidAccessToken(): string | null {
    return this.authTokenService.getValidAccessToken();
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.authTokenService.getAccessToken();
  }

  getSessionId(): string | null {
    return this.authTokenService.getSessionId();
  }

  savePreferences(preferences: UserPreferences): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/auth/save-preferences`, preferences);
  }

  // Get current user from API
  private getCurrentUser(): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.API_BASE_URL}/user/me`);
  }

  getSessions(): Observable<SessionInfo[]> {
    return this.http.get<SessionInfo[]>(`${this.API_BASE_URL}/user/me/sessions`).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  revokeSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/user/me/sessions/${sessionId}`).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  revokeAllSessions(): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/user/me/sessions`).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  deleteAccount(password: string): Observable<void> {
    const params = new HttpParams().set('password', password);

    return this.http.delete<void>(`${this.API_BASE_URL}/user/me`, { params }).pipe(
      tap(() => {
        // Clear refresh timer and auth state
        this.clearTokenRefreshTimer();
        this.authTokenService.clearAuthState();
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        if (error.status === 401) {
          return throwError(() => new Error('Invalid password. Please try again.'));
        }
        return throwError(() => new Error(error.error?.detail || 'Failed to delete account'));
      })
    );
  }

  /**
   * Start automatic token refresh timer
   * Schedules token refresh before expiration
   */
  private startTokenRefreshTimer(): void {
    // Clear any existing timer
    this.clearTokenRefreshTimer();

    // Calculate time until token needs refresh
    const timeUntilRefresh = this.authTokenService.getTimeUntilExpiration() - (5 * 60 * 1000); // 5 minutes before expiration

    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.scheduleTokenRefresh();
      }, timeUntilRefresh);
    } else if (this.authTokenService.getAccessToken()) {
      // Token is already expired or close to expiration, refresh immediately
      this.scheduleTokenRefresh();
    }
  }

  /**
   * Execute token refresh and handle errors
   */
  private scheduleTokenRefresh(): void {
    this.refreshSession().subscribe({
      next: () => {
        console.log('Token refreshed successfully');
      },
      error: (error) => {
        console.error('Failed to refresh token:', error);
        // On refresh failure, clear auth state and redirect to login
        this.clearTokenRefreshTimer();
        this.authTokenService.clearAuthState();
      }
    });
  }

  /**
   * Clear the token refresh timer
   */
  private clearTokenRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

}
