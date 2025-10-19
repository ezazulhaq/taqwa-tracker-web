import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { environment } from "../../environments/environment";

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Wait for auth service to initialize
    await authService.ensureInitialized();

    // Check if user is authenticated after initialization
    if (authService.isAuthenticated()) {
        // Validate session is still valid
        const isValid = await authService.validateSession();
        if (isValid) {
            return true;
        }
    }

    // Redirect to login page with return URL
    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};