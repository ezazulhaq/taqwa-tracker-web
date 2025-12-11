import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthSession, LoginCredentials, UserMetaData, RegisterCredentials, User, ApiUser, LoginResponse } from '../model/auth.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { RateLimitService } from './rate-limit.service';
import { SanitizationService } from './sanitization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private rateLimitService = inject(RateLimitService);
  private sanitizationService = inject(SanitizationService);
  private initializationPromise: Promise<void>;
  private readonly API_BASE_URL = environment.apiBaseUrl;

  // Use signals for reactive state management (Angular v14+)
  currentUser = signal<User | null>(null);
  userMetaData = signal<UserMetaData | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Initialize and wait for session load
    this.initializationPromise = this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const user = await this.getCurrentUser().toPromise();
        if (user) {
          this.setUserFromApiResponse(user);
        }
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
      this.clearAuthState();
    }
  }

  private setUserFromApiResponse(user: ApiUser): void {
    this.currentUser.set({
      id: user.id,
      email: user.email || '',
      createdAt: user.created_at,
      displayName: user.full_name
    });
    this.userMetaData.set({
      sub: user.id,
      email: user.email,
      username: user.full_name,
      full_name: user.full_name,
      email_verified: user.is_verified,
      phone_verified: false
    });
    this.isAuthenticated.set(true);
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
      this.setUserFromApiResponse(user);
    }

    // Store tokens in localStorage
    if (tokenResponse.access_token) {
      localStorage.setItem('access_token', tokenResponse.access_token);
    }
    if (tokenResponse.refresh_token) {
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);
    }

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
        localStorage.setItem('access_token', tokenResponse.access_token);
        if (tokenResponse.refresh_token) {
          localStorage.setItem('refresh_token', tokenResponse.refresh_token);
        }
        this.isAuthenticated.set(true)
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
        this.setUserFromApiResponse(user);
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
    return this.http.post<void>(`${this.API_BASE_URL}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.clearAuthState();
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        // Clear local state even if API call fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.clearAuthState();
        this.router.navigate(['/home']);
        return throwError(() => new Error(error.message || 'Failed to logout'));
      })
    );
  }

  refreshSession(): Observable<AuthSession> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearAuthState();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken }).pipe(
      map(tokenResponse => {
        // Store new tokens
        localStorage.setItem('access_token', tokenResponse.access_token);
        if (tokenResponse.refresh_token) {
          localStorage.setItem('refresh_token', tokenResponse.refresh_token);
        }

        return {
          user: this.currentUser(),
          metaData: this.userMetaData(),
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || refreshToken
        };
      }),
      catchError(error => {
        // Clear user state on refresh failure
        this.clearAuthState();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return throwError(() => new Error(error.message || 'Failed to refresh session'));
      })
    );
  }

  // Security methods
  async validateSession(): Promise<boolean> {
    // Ensure initialization is complete before validating
    await this.initializationPromise;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.clearAuthState();
        return false;
      }

      // Try to get current user to validate token
      const user = await this.getCurrentUser().toPromise();
      return !!user;
    } catch {
      this.clearAuthState();
      return false;
    }
  }

  // Method to ensure auth service is initialized
  async ensureInitialized(): Promise<void> {
    await this.initializationPromise;
  }

  clearAuthState(): void {
    this.currentUser.set(null);
    this.userMetaData.set(null);
    this.isAuthenticated.set(false);
  }

  getValidAccessToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  // Get current access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Get current user from API
  private getCurrentUser(): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.API_BASE_URL}/user/me`);
  }

}
