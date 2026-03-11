import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ErrorStateService } from '../utilities/error-page/error-page.service';

export const errorGuard: CanActivateFn = (route, state) => {
	const errroStateService = inject(ErrorStateService);
	const router = inject(Router);

	if(!errroStateService.currentError){ 
		router.navigate(['/']);
	}

	return errroStateService.currentError;
};
