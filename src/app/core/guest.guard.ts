import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppService } from '../app.service';

export const guestGuard: CanActivateFn = (route, state) => {
	const appService = inject(AppService);
	const router = inject(Router);

	const user = appService.currentUser;

	router.navigate(['/']);
	return false;
};
