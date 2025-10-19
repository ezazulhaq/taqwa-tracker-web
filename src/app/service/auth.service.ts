import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthSession, LoginCredentials, UserMetaData, RegisterCredentials, User } from '../model/auth.model';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { tap } from 'rxjs/internal/operators/tap';
import { RateLimitService } from './rate-limit.service';
import { SanitizationService } from './sanitization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;
  private router = inject(Router);
  private rateLimitService = inject(RateLimitService);
  private sanitizationService = inject(SanitizationService);
  private initializationPromise: Promise<void>;

  // Use signals for reactive state management (Angular v14+)
  currentUser = signal<User | null>(null);
  userMetaData = signal<UserMetaData | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    // Initialize and wait for session load
    this.initializationPromise = this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        console.error('Error loading user session:', error);
        return;
      }

      if (data.session) {
        this.setUserFromSession(data.session.user);
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
    }
  }

  private setUserFromSession(user: any): void {
    this.currentUser.set({
      id: user.id,
      email: user.email || '',
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at
    });
    this.userMetaData.set({
      sub: user.user_metadata.sub,
      email: user.user_metadata.email,
      username: user.user_metadata.username,
      full_name: user.user_metadata.full_name,
      email_verified: user.user_metadata.email_verified,
      phone_verified: user.user_metadata.phone_verified
    });
    this.isAuthenticated.set(true);
  }

  private handleAuthError(error: any): Observable<never> {
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
    return throwError(() => new Error(error.message || 'An unexpected error occurred'));
  }

  private createAuthSession(session: any, user: any): AuthSession {
    if (user) {
      this.setUserFromSession(user);
    }
    return {
      user: this.currentUser(),
      metaData: this.userMetaData(),
      accessToken: session?.access_token || null,
      refreshToken: session?.refresh_token || null
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

    return from(this.supabase.auth.signInWithPassword({
      email,
      password: credentials.password,
    })).pipe(
      map(response => {
        if (response.error) {
          this.rateLimitService.recordAttempt(email, false);
          throw new Error(response.error.message);
        }

        this.rateLimitService.recordAttempt(email, true);
        return this.createAuthSession(response.data.session, response.data.user);
      }),
      catchError(error => this.handleAuthError(error))
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

    return from(this.supabase.auth.signUp({
      email,
      password: credentials.password,
      options: {
        data: {
          username,
          full_name: username
        }
      }
    })).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data.session && response.data.user) {
          // Email confirmation required
          return {
            user: null,
            metaData: null,
            accessToken: null,
            refreshToken: null
          };
        }

        return this.createAuthSession(response.data.session, response.data.user);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  forgotPassword(email: string): Observable<void> {
    return from(this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`
      }
    )).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return void 0;
      }),
      catchError(error => {
        if (error.message?.includes('Invalid email')) {
          return throwError(() => new Error('Please enter a valid email address'));
        }
        if (error.message?.includes('Email not found')) {
          return throwError(() => new Error('No account found with this email address'));
        }
        return throwError(() => new Error(error.message || 'Failed to send reset email'));
      })
    );
  }

  updatePassword(newPassword: string): Observable<void> {
    return from(this.supabase.auth.updateUser({
      password: newPassword
    })).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return void 0;
      }),
      catchError(error => {
        if (error.message?.includes('Password should be at least')) {
          return throwError(() => new Error('Password must be at least 6 characters long'));
        }
        if (error.message?.includes('New password should be different')) {
          return throwError(() => new Error('New password must be different from current password'));
        }
        if (error.message?.includes('Unauthorized')) {
          return throwError(() => new Error('You must be logged in to update your password'));
        }
        return throwError(() => new Error(error.message || 'Failed to update password'));
      })
    );
  }

  updateProfile(updates: { username?: string; full_name?: string }): Observable<UserMetaData> {
    // Sanitize inputs
    const sanitizedUpdates = {
      username: updates.username ? this.sanitizationService.sanitizeText(updates.username) : undefined,
      full_name: updates.full_name ? this.sanitizationService.sanitizeText(updates.full_name) : undefined
    };

    return from(this.supabase.auth.updateUser({
      data: {
        username: sanitizedUpdates.username,
        full_name: sanitizedUpdates.full_name || sanitizedUpdates.username, // Use username as full_name if not provided
      }
    })).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        // Update local state with new user metadata
        if (response.data.user) {
          const updatedMetadata: UserMetaData = {
            sub: response.data.user.user_metadata['sub'],
            email: response.data.user.user_metadata['email'],
            username: response.data.user.user_metadata['username'],
            full_name: response.data.user.user_metadata['full_name'],
            email_verified: response.data.user.user_metadata['email_verified'],
            phone_verified: response.data.user.user_metadata['phone_verified']
          };

          this.userMetaData.set(updatedMetadata);
          return updatedMetadata;
        }

        throw new Error('Failed to update user metadata');
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
    return from(this.supabase.auth.signOut()).pipe(
      tap(() => {
        this.clearAuthState();
        this.router.navigate(['/home']);
      }),
      map(() => void 0),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Failed to logout'));
      })
    );
  }

  refreshSession(): Observable<AuthSession> {
    return from(this.supabase.auth.refreshSession()).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        const session = response.data.session;
        const user = response.data.user;

        // Update user state with refreshed session
        if (user && session) {
          this.setUserFromSession(user);
        } else {
          // Session expired, clear user state
          this.currentUser.set(null);
          this.isAuthenticated.set(false);
        }

        return {
          user: this.currentUser(),
          metaData: this.userMetaData(),
          accessToken: session?.access_token || null,
          refreshToken: session?.refresh_token || null
        };
      }),
      catchError(error => {
        // Clear user state on refresh failure
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        return throwError(() => new Error(error.message || 'Failed to refresh session'));
      })
    );
  }

  // Security methods
  async validateSession(): Promise<boolean> {
    // Ensure initialization is complete before validating
    await this.initializationPromise;

    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error || !data.session) {
        this.clearAuthState();
        return false;
      }
      return true;
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
    this.isAuthenticated.set(false);
  }

  getValidAccessToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      // Get token from Supabase client instead of localStorage directly
      const session = this.supabase.auth.getSession();
      return session ? (session as any).data?.session?.access_token || null : null;
    } catch {
      return null;
    }
  }

  // Get authenticated Supabase client with access token
  getAuthenticatedClient(): SupabaseClient {
    return this.supabase;
  }

  // Get current access token asynchronously
  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || null;
  }

}
