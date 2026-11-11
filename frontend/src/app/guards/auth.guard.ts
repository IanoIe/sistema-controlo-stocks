import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/AuthService';

/**
 * Authentication guard that protects routes from unauthorized access.
 * Checks whether the user is authenticated before allowing navigation.
 */
export const authGuard: CanActivateFn = () => {
  // Injects the authentication service and Angular router.
  const authService = inject(AuthService);
  const router = inject(Router);
  // Allows navigation if the user is authenticated.
  if (authService.isAuthenticated()) {
    return true;
  }
  // Redirects unauthenticated users to the login page.
  return router.createUrlTree(['/login']);
};
