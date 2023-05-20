import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../domain/User';

export function homeFlagGuard(
  flagName: string,
  redirectRoute: string
): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const user = inject(User);
    const isFlagEnabled = user.isLogged;

    return isFlagEnabled || router.createUrlTree([redirectRoute]);
  };
}