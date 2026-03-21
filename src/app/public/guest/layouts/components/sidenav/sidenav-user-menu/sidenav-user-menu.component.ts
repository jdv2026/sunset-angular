import { Component, OnInit } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'vex-sidenav-user-menu',
	templateUrl: './sidenav-user-menu.component.html',
	styleUrls: ['./sidenav-user-menu.component.scss'],
	imports: [MatRippleModule, RouterLink, MatIconModule],
	standalone: true,
})
export class SidenavUserMenuComponent implements OnInit {
	public loading: boolean = false;

	constructor(
		private router: Router,
		private readonly popoverRef: VexPopoverRef,
	) {}

	ngOnInit(): void {}

	async onLogout(): Promise<void> {
		await this.delayClosePopover();
		this.router.navigate(['/']);
	}

	async onOpenProfile(): Promise<void> {
		await this.delayClosePopover();
		this.router.navigate(['/guest/profile']);
	}

	private async delayClosePopover(): Promise<void> {
		await this.sleep(250);
		this.popoverRef.close();
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}
