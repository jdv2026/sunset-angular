import { Component, OnInit } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from 'src/app/app.service';
import { LoggerService } from 'src/app/services/Logger.service';
import { StorageService } from 'src/app/services/Storage.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SidenavUserMenuService } from './sidenav-user-menu.service';

@Component({
	selector: 'vex-sidenav-user-menu',
	templateUrl: './sidenav-user-menu.component.html',
	styleUrls: ['./sidenav-user-menu.component.scss'],
	imports: [MatRippleModule, RouterLink, MatIconModule],
	standalone: true,
	providers: [SidenavUserMenuService],
})
export class SidenavUserMenuComponent implements OnInit {
	public loading: boolean = false;

	constructor(
		private appService: AppService,
		private logService: LoggerService,
		private router: Router,
		private storageService: StorageService,
		private readonly popoverRef: VexPopoverRef,
		private readonly dialog: MatDialog,
		private readonly sidenavUserMenuService: SidenavUserMenuService
	) {}

	ngOnInit(): void {}

	async onLogout(): Promise<void> {
		await this.delayClosePopover();
	
		const dialogRef = this.dialog.open(LoadingComponent, {
			disableClose: true,
			panelClass: 'loading-dialog',
			backdropClass: 'loading-backdrop',
			data: { title: 'Logging out', message: 'Please wait' },
			width: '400px'
		});
	
		try {
			const res = await this.sidenavUserMenuService.initiateLogout();
			this.logService.debug('logout', res);
			this.storageService.clearToken();
			this.appService.setUser(null);
			await this.sleep(500);
			this.router.navigate(['/']);
		} 
		catch (err) {
			this.logService.error('logout', err);
		}
		finally {
			dialogRef.close();
		}
	}

	async onOpenProfile(): Promise<void> {
		await this.delayClosePopover();
		this.navigateToProfile();
	}

	private async delayClosePopover(): Promise<void> {
		await this.sleep(250);
		this.popoverRef.close();
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private navigateToProfile(): void {
		const id = this.appService.currentUser?.id;
		this.router.navigate([`dashboard/profile/${id}`]);
	}

}
