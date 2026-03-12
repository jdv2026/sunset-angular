import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "src/app/services/BaseApi.service";
import { ApiRequest } from "../contracts/ApiRequest";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiResponse } from "../contracts/ApiResponse";
import { crumbs, MetaDataResponse } from "./private.contracts";
import { StorageService } from "../services/Storage.service";
import { AppService } from "../app.service";
import { LoggerService } from "../services/Logger.service";

@Injectable(
	{
		providedIn: 'root'
	}
)
export class PrivateService extends BaseApiService {

	private _crumbs$ = new BehaviorSubject<crumbs>({
		current: '',
		crumbs: []
	});
	public crumbs$: Observable<crumbs> = this._crumbs$.asObservable();

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

	setCrumbs(crumbs: crumbs) {
		this._crumbs$.next(crumbs);
	}
	
	get crumbs() {
		return this._crumbs$.getValue();
	}

	isAuthenticated(): boolean {
		return this.storageService.hasToken();
	}

	fetchUserData(): Promise<ApiResponse<MetaDataResponse>> {
		this.appService.postRequestParameter.url = 'web/user';
		return this.authServicePost(this.appService.postRequestParameter);
	}

	fetchNavigationList(): Promise<ApiResponse<MetaDataResponse>> {
		this.appService.postRequestParameter.url = 'web/nav';
		return this.authServicePost(this.appService.postRequestParameter);
	}

}