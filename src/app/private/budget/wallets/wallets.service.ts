import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/contracts/ApiRequest';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { BaseApiService } from 'src/app/services/BaseApi.service';
import { LoggerService } from 'src/app/services/Logger.service';
import { StorageService } from 'src/app/services/Storage.service';

@Injectable({
	providedIn: 'root',
})
export class WalletsService extends BaseApiService {

	constructor(
		protected override readonly http: HttpClient,
		protected override readonly logService: LoggerService,
		protected override readonly storageService: StorageService,
	) {
		super(http, logService, storageService);
	}

	fetchActiveWallets(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-wallets');
	}

	storeWallet(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/budget-active-wallets';
		return this.budgetServicePost(payload);
	}

	updateWallet(id: number, payload: any): Promise<ApiResponse> {
		return this.budgetServicePut(`web/budget-active-wallets/${id}`, payload);
	}

	deleteWallet(id: number): Promise<ApiResponse> {
		return this.budgetServiceDelete(`web/budget-active-wallets/${id}`);
	}

}
