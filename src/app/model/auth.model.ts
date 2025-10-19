export interface User {
    id: string;
    email: string;
    displayName?: string;
    createdAt?: string;
    lastSignInAt?: string;
}

export interface UserMetaData {
    sub: string;
    email?: string;
    full_name?: string;
    username?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
}

export interface AuthSession {
    user: User | null;
    metaData: UserMetaData | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    username?: string;
}