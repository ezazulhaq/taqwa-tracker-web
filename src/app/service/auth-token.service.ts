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

    setUserFromApiResponse(user: ApiUser): void {
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

    clearAuthState(): void {
        this.currentUser.set(null);
        this.userMetaData.set(null);
        this.isAuthenticated.set(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    getValidAccessToken(): string | null {
        if (!this.isAuthenticated()) {
            return null;
        }
        return localStorage.getItem('access_token');
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    setTokens(accessToken: string, refreshToken?: string): void {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        this.isAuthenticated.set(true);
    }
}
