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
export class BillsService extends BaseApiService {

	constructor(
		protected override readonly http: HttpClient,
		protected override readonly logService: LoggerService,
		protected override readonly storageService: StorageService,
	) {
		super(http, logService, storageService);
	}

	fetchActiveBills(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-bills');
	}

	storeBill(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/budget-active-bills';
		return this.budgetServicePost(payload);
	}

	updateBill(id: number, payload: any): Promise<ApiResponse> {
		return this.budgetServicePut(`web/budget-active-bills/${id}`, payload);
	}

	deleteBill(id: number): Promise<ApiResponse> {
		return this.budgetServiceDelete(`web/budget-active-bills/${id}`);
	}

}
