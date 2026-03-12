import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { ApiRequest } from "src/app/contracts/ApiRequest";
import { ApiResponse } from "src/app/contracts/ApiResponse";
import { BaseApiService } from "src/app/services/BaseApi.service";
import { MetaDataResponse, settingModify } from "./private/private.contracts";
import { ApiMeta } from "./contracts/ParamsRequest";
import { VexColorScheme } from "@vex/config/vex-config.interface";
import { StorageService } from "./services/Storage.service";
import { LoggerService } from "./services/Logger.service";
import { User } from "./public/login/login.contract";

@Injectable({ providedIn: "root" })
export class AppService extends BaseApiService {

	public postRequestParameter!: ApiRequest;

	private _metaData$ = new BehaviorSubject<MetaDataResponse | null>(null);
	protected metaData$: Observable<MetaDataResponse | null> = this._metaData$.asObservable();
	public version$: Observable<string> = this._metaData$.pipe(map(data => data?.dbVersions.version ?? ''));

	private _user$ = new BehaviorSubject<User | null>(null);
	protected user$: Observable<User | null> = this._user$.asObservable();

	private _setting$ = new BehaviorSubject<settingModify>(
		{
			name: '',
			className: '',
			orientation: '',
			toolBar: true,
			footer: false,
			footerFixed: false,
			isDarkMode: VexColorScheme.LIGHT,
			updatedAt: '',
			updatedBy: {first_name: '', last_name: ''}
		}
	);
	protected setting$: Observable<settingModify> = this._setting$.asObservable();

	loading$: Observable<boolean> = this._metaData$.pipe(
		map(data => data === null)
	);

	constructor(
		protected readonly http: HttpClient,
		protected readonly storageService: StorageService,
		protected readonly logService: LoggerService
	) {
		super(
			http,
			logService,
			storageService,
		);
		this.postRequestParameter = {
			params: {api_time: new Date().toISOString()},
			payload: {token: this.storageService.getToken()},
			url: '',
		};
	}

	get currentMetaData(): MetaDataResponse | null {
        return this._metaData$.getValue();
    }

	setMetaData(data: MetaDataResponse) {
        this._metaData$.next(data);
    }

	get currentUser(): User | null {
		return this._user$.getValue();
	}

	setUser(data: User | null) {
		this._user$.next(data);
	}

	setSetting(data: settingModify) {
		this._setting$.next(data);
	}

	get currentSetting(): settingModify {
		return this._setting$.getValue();
	}

	get params(): ApiMeta {
		return {
			api_time: new Date().toISOString(),
		}
	}

	handleAppInitialization(): Promise<ApiResponse<MetaDataResponse>> {
		this.postRequestParameter.url = 'web/meta/data';
		return this.authServicePost(this.postRequestParameter);
	}

	globalApiCall(params: ApiRequest): Promise<ApiResponse<MetaDataResponse>> {
		return this.authServicePost(params);
	}

}