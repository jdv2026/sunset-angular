import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { ApiResponse } from "src/app/contracts/ApiResponse";
import { MetaDataResponse } from "src/app/private/private.contracts";
import { BaseApiService } from "src/app/services/BaseApi.service";
import { LoggerService } from "src/app/services/Logger.service";
import { StorageService } from "src/app/services/Storage.service";

@Injectable()
export class SidenavUserMenuService extends BaseApiService {

	constructor(
		protected readonly http: HttpClient,
		private readonly appService: AppService,
		protected readonly logService: LoggerService,
		protected readonly storageService: StorageService,
	) {
		super(
			http,
			logService,
			storageService,
		);
	}

	initiateLogout(): Promise<ApiResponse<MetaDataResponse>> {
		this.appService.postRequestParameter.url = 'web/admin/logout';
		return this.post(this.appService.postRequestParameter);
	}

}
