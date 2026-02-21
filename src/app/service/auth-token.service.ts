import { Injectable, signal } from '@angular/core';
import { User, UserMetaData, ApiUser } from '../model/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthTokenService {
    // Use signals for reactive state management
    currentUser = signal<User | null>(null);
    userMetaData = signal<UserMetaData | null>(null);
    isAuthenticated = signal<boolean>(!!localStorage.getItem('access_token'));

    // Token expiration buffer (5 minutes before actual expiration)
    private readonly TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

    setUserFromApiResponse(user: ApiUser): void {
        this.currentUser.set({
            id: user.id,
            email: user.email || '',
            createdAt: user.created_at,
            displayName: user.full_name,
            preferences: user.preferences
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

    clearAuthState(): void {
        this.currentUser.set(null);
        this.userMetaData.set(null);
        this.isAuthenticated.set(false);
        ['access_token', 'refresh_token', 'session_id', 'token_expiration'].forEach(key => {
            localStorage.removeItem(key);
        });
    }

    getValidAccessToken(): string | null {
        if (!this.isAuthenticated() || this.isTokenExpired()) {
            return null;
        }
        return this.getAccessToken();
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    /**
     * Tokens are always stored in localStorage for persistence across browser restarts.
     */
    isUsingPersistentStorage(): boolean {
        return true;
    }

    setTokens(accessToken: string, refreshToken?: string, sessionId?: string, expiresIn?: number): void {
        // Always persist in localStorage so sessions survive browser restarts / PWA kills
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        if (sessionId) {
            localStorage.setItem('session_id', sessionId);
        }

        // Store token expiration time (default to 1 hour if not provided)
        const expirationMs = expiresIn ? expiresIn * 1000 : 60 * 60 * 1000;
        const expirationTime = Date.now() + expirationMs;
        localStorage.setItem('token_expiration', expirationTime.toString());

        this.isAuthenticated.set(true);
    }

    getSessionId(): string | null {
        return localStorage.getItem('session_id');
    }

    /**
     * Check if the access token is expired or close to expiration
     */
    isTokenExpired(): boolean {
        const expirationTime = this.getTokenExpirationTime();
        if (!expirationTime) {
            // No expiration stored — fail safe: treat as expired and force a refresh.
            // This prevents a stale or missing timestamp from keeping an expired token alive.
            return true;
        }
        return Date.now() >= expirationTime;
    }

    /**
     * Check if token needs refresh (within buffer time before expiration)
     */
    shouldRefreshToken(): boolean {
        const expirationTime = this.getTokenExpirationTime();
        if (!expirationTime) {
            return false;
        }
        // Refresh if we're within the buffer time of expiration
        return Date.now() >= (expirationTime - this.TOKEN_REFRESH_BUFFER_MS);
    }

    /**
     * Get the token expiration timestamp
     */
    getTokenExpirationTime(): number | null {
        const expiration = localStorage.getItem('token_expiration');
        return expiration ? parseInt(expiration, 10) : null;
    }

    /**
     * Get time remaining until token expires (in milliseconds)
     */
    getTimeUntilExpiration(): number {
        const expirationTime = this.getTokenExpirationTime();
        if (!expirationTime) {
            return 0;
        }
        return Math.max(0, expirationTime - Date.now());
    }
}
