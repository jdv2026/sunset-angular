import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/Storage.service';

export const authGuard: CanActivateFn = (route, state) => {
	const storageService = inject(StorageService);
	const router = inject(Router);

	const storage = storageService.hasToken();

	if (storage) {
		return true;
	}
	router.navigate(['/']);
	return false;
};
