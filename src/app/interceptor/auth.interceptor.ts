import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { AuthTokenService } from "../service/auth-token.service";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../service/auth.service";

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authTokenService = inject(AuthTokenService);
    const injector = inject(Injector);

    // Clone request with auth token if available
    const clonedReq = addAuthToken(req, authTokenService);

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 Unauthorized errors
            if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
                return handle401Error(req, next, authTokenService, injector);
            }
            return throwError(() => error);
        })
    );
};

/**
 * Add authorization token to request if available
 */
function addAuthToken(req: HttpRequest<unknown>, authTokenService: AuthTokenService): HttpRequest<unknown> {
    if (authTokenService.isAuthenticated()) {
        const token = authTokenService.getValidAccessToken();
        if (token) {
            return req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }
    return req;
}

/**
 * Handle 401 errors by attempting to refresh the token
 */
function handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authTokenService: AuthTokenService,
    injector: Injector
) {
    if (!isRefreshing) {
        isRefreshing = true;

        // Get AuthService using injector to avoid circular dependency
        const authService = injector.get(AuthService);

        return authService.refreshSession().pipe(
            switchMap(() => {
                isRefreshing = false;
                // Retry the original request with new token
                const clonedReq = addAuthToken(req, authTokenService);
                return next(clonedReq);
            }),
            catchError((error) => {
                isRefreshing = false;
                // Refresh failed, clear auth state
                authTokenService.clearAuthState();
                return throwError(() => error);
            })
        );
    }

    // If already refreshing, just retry with current token
    const clonedReq = addAuthToken(req, authTokenService);
    return next(clonedReq);
}
