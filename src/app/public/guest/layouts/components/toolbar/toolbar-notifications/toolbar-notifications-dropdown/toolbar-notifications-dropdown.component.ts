import { Component, OnInit } from '@angular/core';
import { Notification } from '../interfaces/notification.interface';
import { trackById } from '@vex/utils/track-by';
import { VexDateFormatRelativePipe } from '@vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe';
import { Router, RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PrivateService } from 'src/app/private/private.service';
import { ApiRequest } from 'src/app/contracts/ApiRequest';
import { LoggerService } from 'src/app/services/Logger.service';
import { StorageService } from 'src/app/services/Storage.service';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { notification } from 'src/app/private/private.contracts';
import { AppService } from 'src/app/app.service';
import { ToolbarNotificationsDropdownService } from './toolbar-notifications-dropdown.service';

@Component({
	selector: 'vex-toolbar-notifications-dropdown',
	templateUrl: './toolbar-notifications-dropdown.component.html',
	styleUrls: ['./toolbar-notifications-dropdown.component.scss'],
	standalone: true,
	imports: [
		MatButtonModule,
		MatMenuModule,
		MatIconModule,
		NgFor,
		MatRippleModule,
		RouterLink,
		NgClass,
		VexDateFormatRelativePipe
	],
	providers: [ToolbarNotificationsDropdownService],
})
export class ToolbarNotificationsDropdownComponent implements OnInit {
	notifications: Notification[] = [];

	trackById = trackById;

	constructor(
		private readonly privateService: PrivateService,
		private readonly logService: LoggerService,
		private readonly storageService: StorageService,
		private readonly appService: AppService,
		private readonly router: Router,
		private readonly toolbarNotificationsDropdownService: ToolbarNotificationsDropdownService
	) {}

	ngOnInit() {
		this.initializeNotification();
	}

	async onMarkAsRead(notification: Notification): Promise<void> {
		try {
			await this.toolbarNotificationsDropdownService.markAllNotificationAsRead(notification);
			this.logService.debug('Mark as read');
			this.initializeNotification();
			this.redirectToProfile(notification.userId);
		}
		catch (err: unknown) {
			this.logService.error('Mark as read', err);
		}
	}

	async markAllAsRead(): Promise<void> {
		try {
			await this.toolbarNotificationsDropdownService.markAllAsRead();
			this.logService.debug('Mark all as read');
			this.initializeNotification();
		}
		catch (err: unknown) {
			this.logService.error('Mark all as read', err);
		}
		const params2: ApiRequest = {
			params: this.appService.params,
			payload: {
				token: this.storageService.getToken()
			},
			url: 'web/mark/notifications/as/all/read',
		}
	}

	private redirectToProfile(id: string | undefined): void {
		this.router.navigate([`dashboard/profile/${id}`]);
	}

	private async initializeNotification(): Promise<void> {
		try {
			const res: ApiResponse = await this.toolbarNotificationsDropdownService.fetchNotification();
			this.logService.debug('notifications', res);
			const data = res.payload;

			const notifications: Notification[] = data.map((item: notification) => {
				return {
					...item,
					id: item.id.toString(),
					label: item.label,
					icon: item.icon,
					colorClass: item.color_class,
					datetime: item.datetime,
					read: item.read,
					userId: item.user_id
				};
			})
			this.notifications = notifications;
		}
		catch (err: unknown) {
			this.logService.error('notifications', err);
		}
	}

}
