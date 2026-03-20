import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { BaseApiService } from 'src/app/services/BaseApi.service';
import { LoggerService } from 'src/app/services/Logger.service';
import { StorageService } from 'src/app/services/Storage.service';

@Injectable({
	providedIn: 'root',
})
export class OverviewService extends BaseApiService {

	constructor(
		protected override readonly http: HttpClient,
		protected override readonly logService: LoggerService,
		protected override readonly storageService: StorageService,
	) {
		super(http, logService, storageService);
	}

	fetchActiveOverview(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-overview');
	}
}
