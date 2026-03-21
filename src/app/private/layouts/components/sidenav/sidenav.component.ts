import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NavigationItem } from '../../navigation/navigation-item.interface';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { Observable, of } from 'rxjs';
import { SidenavUserMenuComponent } from './sidenav-user-menu/sidenav-user-menu.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AppService } from 'src/app/app.service';

@Component({
	selector: 'vex-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	standalone: true,
	imports: [
		NgIf,
		MatButtonModule,
		MatIconModule,
		MatRippleModule,
		VexScrollbarComponent,
		NgFor,
		SidenavItemComponent,
		AsyncPipe
	]
})
export class SidenavComponent implements OnInit {
	@Input() collapsed: boolean = false;
	public collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
	public title$ = this.configService.config$.pipe(
		map((config) => config.sidenav.title)
	);
	public imageUrl$ = this.configService.config$.pipe(
		map((config) => config.sidenav.imageUrl)
	);
	public showCollapsePin$ = this.configService.config$.pipe(
		map((config) => config.sidenav.showCollapsePin)
	);
	public userVisible$ = this.configService.config$.pipe(
		map((config) => config.sidenav.user.visible)
	);
	public searchVisible$ = this.configService.config$.pipe(
		map((config) => config.sidenav.search.visible)
	);

	public userMenuOpen$: Observable<boolean> = of(false);

	public items$: Observable<NavigationItem[]> = this.navigationService.items$;
	public name: string = '';
	public role: string = '';
	public initials: string = '?';

	constructor(
		private navigationService: NavigationService,
		private layoutService: VexLayoutService,
		private configService: VexConfigService,
		private readonly popoverService: VexPopoverService,
		private readonly appService: AppService
	) {}

	ngOnInit() {
		const user = this.appService.currentUser;
		if (user) {
			const first = user.first_name ?? '';
			const last = user.last_name ?? '';
			this.name = (first + ' ' + last).trim() || 'Not Available';
			this.role = user.type;
			this.initials = (first.charAt(0) + last.charAt(0)).toUpperCase() || '?';
		}
	}

	collapseOpenSidenav() {
		this.layoutService.collapseOpenSidenav();
	}

	collapseCloseSidenav() {
		this.layoutService.collapseCloseSidenav();
	}

	toggleCollapse() {
		this.collapsed
		? this.layoutService.expandSidenav()
		: this.layoutService.collapseSidenav();
	}

	trackByRoute(_index: number, item: NavigationItem): string {
		if (item.type === 'link') {
		return item.route;
		}

		return item.label;
	}

	openProfileMenu(origin: HTMLDivElement): void {
		this.userMenuOpen$ = of(
		this.popoverService.open({
			content: SidenavUserMenuComponent,
			origin,
			offsetY: -8,
			width: origin.clientWidth,
			position: [
			{
				originX: 'center',
				originY: 'top',
				overlayX: 'center',
				overlayY: 'bottom'
			}
			]
		})
		).pipe(
		switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
		startWith(true)
		);
	}

	openSearch(): void {

	}
}
