import { Component, OnInit } from '@angular/core';
import { BaseLayoutComponent } from 'src/app/private/layouts/base-layout/base-layout.component';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { ToolbarComponent } from 'src/app/private/layouts/components/toolbar/toolbar.component';
import { QuickpanelComponent } from 'src/app/private/layouts/components/quickpanel/quickpanel.component';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { combineLatest, map, Observable } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { FooterComponent } from 'src/app/private/layouts/footer/footer.component';
import { SidenavComponent } from 'src/app/private/layouts/components/sidenav/sidenav.component';
import { NavigationItem } from 'src/app/private/layouts/navigation/navigation-item.interface';
import { NavigationLoaderService } from 'src/app/private/layouts/navigation/navigation-loader.service';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { crumbs } from 'src/app/private/private.contracts';
import { VexConfig } from '@vex/config/vex-config.interface';
import { PrivateService } from 'src/app/private/private.service';
import { MainLoadingComponent } from 'src/app/utilities/main-loading/main-loading.component';

@Component({
	selector: 'vex-guest',
	standalone: true,
	imports: [
		BaseLayoutComponent,
		NgIf,
		AsyncPipe,
		SidenavComponent,
		ToolbarComponent,
		FooterComponent,
		QuickpanelComponent,
		VexSidebarComponent,
		MatDialogModule,
		MatSidenavModule,
		NgTemplateOutlet,
		RouterOutlet,
		VexProgressBarComponent,
		VexBreadcrumbsComponent,
		VexPageLayoutHeaderDirective,
		VexPageLayoutComponent,
		VexSecondaryToolbarComponent,
		MainLoadingComponent,
	],
	templateUrl: './guest.component.html',
	styleUrl: './guest.component.scss',
})

export class GuestComponent implements OnInit {

	public isLoading: boolean = false;
	public crumbs$: Observable<crumbs> = this.privateService.crumbs$;
	public config$: Observable<VexConfig> = this.configService.config$;
	public sidenavCollapsed$: Observable<boolean> = this.layoutService.sidenavCollapsed$;
	public sidenavDisableClose$: Observable<boolean> = this.layoutService.isDesktop$;
	public sidenavFixedInViewport$: Observable<boolean> = this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
	public sidenavMode$: Observable<MatDrawerMode> = combineLatest([
		this.layoutService.isDesktop$,
		this.configService.select((config: VexConfig) => config.layout)
	]).pipe(
		map(([isDesktop, layout]) =>
		!isDesktop || layout === 'vertical' ? 'over' : 'side'
		)
	);
	public sidenavOpen$: Observable<boolean> = this.layoutService.sidenavOpen$;
	public configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
	public quickpanelOpen$: Observable<boolean> = this.layoutService.quickpanelOpen$;

	constructor(
		private readonly layoutService: VexLayoutService,
		private readonly configService: VexConfigService,
		private readonly privateService: PrivateService,
		private readonly navigationLoaderService: NavigationLoaderService,
		private readonly router: Router,
	) {}

	ngOnInit() {
		this.crumbs$ = this.privateService.crumbs$;
		if (this.privateService.isAuthenticated()) {
			this.router.navigate(['/dashboard/home']);
		}
		this.initializeNavigation();
	}

	onSidenavClosed(): void {
		this.layoutService.closeSidenav();
	}

	onQuickpanelClosed(): void {
		this.layoutService.closeQuickpanel();
	}

	private initializeNavigation() {
		const navHeading: NavigationItem[] = [
			{
				type: 'subheading',
				label: 'Home',
				children: [
					{
						type: 'link',
						label: 'Home',
						icon: 'mat:home',
						route: '/guest/home'
					}
				],
			},
			{
				type: 'subheading',
				label: 'Budget',
				children: [
					{ type: 'link', label: 'Overview', icon: 'mat:dashboard', route: '/guest/budget/overview' },
					{ type: 'link', label: 'Transactions', icon: 'mat:receipt_long', route: '/guest/budget/transactions' },
					{ type: 'link', label: 'Categories', icon: 'mat:category', route: '/guest/budget/categories' },
					{ type: 'link', label: 'Reports', icon: 'mat:bar_chart', route: '/guest/budget/reports' },
					{ type: 'link', label: 'Goals', icon: 'mat:savings', route: '/guest/budget/goals' },
					{ type: 'link', label: 'Bills', icon: 'mat:event_repeat', route: '/guest/budget/bills' },
				],
			}
		];
		this.navigationLoaderService.loadNavigation(navHeading);
	}

}
