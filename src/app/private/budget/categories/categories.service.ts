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
export class CategoriesService extends BaseApiService {

	constructor(
		protected override readonly http: HttpClient,
		protected override readonly logService: LoggerService,
		protected override readonly storageService: StorageService,
	) {
		super(http, logService, storageService);
	}
	
	fetchCategoriesIcon(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-icon-categories');
	}

	fetchCategoriesColor(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-color-categories');
	}

	fetchActiveCategories(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-categories');
	}

	fetchActiveCategoriesForBills(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-categories/bills');
	}

	fetchActiveCategoriesForGoals(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-categories/goals');
	}

	fetchActiveCategoriesForWallets(): Promise<ApiResponse> {
		return this.budgetServiceGet('web/budget-active-categories/wallets');
	}

	storeCategoriesIcon(payload: ApiRequest): Promise<ApiResponse> {
		payload.url = 'web/store/budget-active-categories';
		return this.budgetServicePost(payload);
	}

	updateActiveCategory(id: number, payload: any): Promise<ApiResponse> {
		return this.budgetServicePut(`web/budget-active-categories/${id}`, payload);
	}

	deleteActiveCategory(id: number): Promise<ApiResponse> {
		return this.budgetServiceDelete(`web/budget-active-categories/${id}`);
	}

}
