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
export class TransactionsService extends BaseApiService {

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

	fetchTransferPayOptions(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-transactions/pay-transfer-options');
	}

	fetchActiveTransactions(params?: { year?: string; month?: string; page?: number; per_page?: number }): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-transactions', params);
	}

	storeTransactionIncome(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/income/budget-active-transactions';
		return this.budgetServicePost(payload);
	}

	storeTransactionTransfer(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/transfer-funds/budget-active-transactions';
		return this.budgetServicePost(payload);
	}

	storeTransactionPay(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/pay-bills/budget-active-transactions';
		return this.budgetServicePost(payload);
	}

}
