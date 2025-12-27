import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthTokenService } from "../service/auth-token.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authTokenService = inject(AuthTokenService);

    // Check if the user is authenticated
    if (authTokenService.isAuthenticated()) {
        const token = authTokenService.getValidAccessToken();

        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }

    return next(req);
};
