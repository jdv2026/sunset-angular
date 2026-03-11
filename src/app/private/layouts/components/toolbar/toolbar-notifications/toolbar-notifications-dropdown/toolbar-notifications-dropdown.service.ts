import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ApiResponse } from "src/app/contracts/ApiResponse";
import { BaseApiService } from "src/app/services/BaseApi.service";
import { LoggerService } from "src/app/services/Logger.service";
import { StorageService } from "src/app/services/Storage.service";
import { Notification } from '../interfaces/notification.interface';

@Injectable()
export class ToolbarNotificationsDropdownService extends BaseApiService {


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

	fetchNotification(): Promise<ApiResponse> {
		this.appService.postRequestParameter.url = 'web/get/notifications';
		this.appService.postRequestParameter.payload = this.storageService.getToken();
		return this.post(this.appService.postRequestParameter);
	}

	markAllNotificationAsRead(notification: Notification): Promise<ApiResponse> {
		this.appService.postRequestParameter.url = 'web/mark/notifications/as/read/' + notification.id;
		this.appService.postRequestParameter.payload = {
			token: this.storageService.getToken(),
			id: notification.id
		};
		return this.post(this.appService.postRequestParameter);
	}

	markAllAsRead(): Promise<ApiResponse> {
		this.appService.postRequestParameter.url = 'web/mark/notifications/as/all/read';
		this.appService.postRequestParameter.payload = {
			token: this.storageService.getToken()
		};
		return this.post(this.appService.postRequestParameter);
	}
	
}
