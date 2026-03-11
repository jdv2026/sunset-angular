import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { StorageService } from '../services/Storage.service';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorStateService } from '../utilities/error-page/error-page.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../utilities/error-modal/error-modal.component';
import { ApiError } from '../contracts/ApiError';

/**
 * Attaches Bearer token from AppService to the request.
 * @param req Original HttpRequest
 * @param appService Instance of AppService
 * @returns Cloned HttpRequest with Authorization header if token exists
 */

export const attachTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
	const storageService = inject(StorageService);
	const router = inject(Router);
	const errorState = inject(ErrorStateService);
	const matDialog = inject(MatDialog);

	const token = storageService.getToken();
	const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

	return next(authReq).pipe(
		tap({
			next: (event) => {
				if (event instanceof HttpResponse && req.url.includes('/api') && req.url.includes('/web') && event.body.access_token) {
					storageService.setToken(event.body.access_token);
				}
			},
			error: (err) => {
				const apiError: ApiError = err.error;
				if (apiError.global_error) {
					if (err.status === 401) storageService.clearToken();
					router.navigate(['/error/' + err.status]);
					errorState.setError(true);
					errorState.setApiError(apiError);
				}

				if (apiError.is_show_modal) {
					const modalErrors: { header: string; message: string }[] = !apiError.is_show_modal && apiError.errors && typeof apiError.errors === 'object'
						? Object.entries(apiError.errors).flatMap(([key, msgs]) => (msgs as string[]).map(msg => ({ header: key, message: msg })))
						: [{ header: 'Error', message: apiError.message || 'Unknown error' }];

					matDialog.open(ErrorModalComponent, { data: { errors: modalErrors }, width: '400px' });
				}
			},
		})
	);
}
