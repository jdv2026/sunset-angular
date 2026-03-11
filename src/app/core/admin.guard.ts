import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppService } from '../app.service';
import { ApiResponse } from '../contracts/ApiResponse';
import { LoggerService } from '../services/Logger.service';
import { ErrorStateService } from '../utilities/error-page/error-page.service';

export const adminGuard: CanActivateFn = async () => {
	const appService = inject(AppService);
	const router = inject(Router);
	const logService = inject(LoggerService);
	const errorStateService = inject(ErrorStateService);

	appService.postRequestParameter.url = 'web/check/type';
	
    try {
        const res: ApiResponse = await appService.globalApiCall(appService.postRequestParameter);
        logService.info('check type', res);

        errorStateService.setError(true);
        router.navigate(['/error/403']);
        return false;
    } 
	catch (err: unknown) {
        logService.error('check type', err);
        router.navigate(['/']);
        return false;
    }

};
