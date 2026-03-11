import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ApiResponse } from "src/app/contracts/ApiResponse";
import { BaseApiService } from "src/app/services/BaseApi.service";
import { preLoginResponse, LoginForm } from "./login.contract";
import { LoggerService } from "src/app/services/Logger.service";
import { StorageService } from "src/app/services/Storage.service";
import { QrSetupForm, RecoveryForm } from "./login.contract";

@Injectable()
export class LoginService extends BaseApiService {

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

	adminLogin(requestPayload: LoginForm): Promise<ApiResponse<preLoginResponse>> {
		this.appService.postRequestParameter.url = 'web/user/login';
		this.appService.postRequestParameter.payload = requestPayload;
		return this.post(this.appService.postRequestParameter);
	}

	verify2faCode(payload: QrSetupForm): Promise<ApiResponse<{ token: string }>> {
		this.appService.postRequestParameter.url = 'web/2fa/verify';
		this.appService.postRequestParameter.payload = payload;
		return this.post(this.appService.postRequestParameter);
	}

	verifyFirstTime2faCode(payload: QrSetupForm): Promise<ApiResponse> {
		this.appService.postRequestParameter.url = 'web/firsttime/2fa/verify';
		this.appService.postRequestParameter.payload = payload;
		return this.post(this.appService.postRequestParameter);
	}

	recoverLogin(payload: RecoveryForm): Promise<ApiResponse> {
		this.appService.postRequestParameter.url = 'web/2fa/recovery';
		this.appService.postRequestParameter.payload = payload;
		return this.post(this.appService.postRequestParameter);
	}

}