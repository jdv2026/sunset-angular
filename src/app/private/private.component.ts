import { Component, OnInit } from '@angular/core';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { ToolbarComponent } from './layouts/components/toolbar/toolbar.component';
import { QuickpanelComponent } from './layouts/components/quickpanel/quickpanel.component';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { combineLatest, map, Observable } from 'rxjs';
import { VexColorScheme, VexConfig } from '@vex/config/vex-config.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidenavComponent } from './layouts/components/sidenav/sidenav.component';
import { AppService } from '../app.service';
import { StorageService } from '../services/Storage.service';
import { ApiResponse } from '../contracts/ApiResponse';
import { LoggerService } from '../services/Logger.service';
import { PrivateService } from './private.service';
import { NavigationLink, NavigationSubheading } from './layouts/navigation/navigation-item.interface';
import { crumbs, navigation, navResponse, settingModify } from './private.contracts';
import { NavigationLoaderService } from './layouts/navigation/navigation-loader.service';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MainLoadingComponent } from '../utilities/main-loading/main-loading.component';
import { vexConfigs } from '@vex/config/vex-configs';

@Component({
	selector: 'vex-private',
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
		MainLoadingComponent
	],
	templateUrl: './private.component.html',
	styleUrl: './private.component.scss',
})

export class PrivateComponent implements OnInit {

	public isLoading: boolean = true;
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
	private settings: settingModify | null = null;

	constructor(
		private readonly layoutService: VexLayoutService,
		private readonly configService: VexConfigService,
		private readonly logService: LoggerService,
		private readonly storageService: StorageService,
		private readonly privateService: PrivateService,
		private readonly appService: AppService,
		private readonly navigationLoaderService: NavigationLoaderService
	) {}

	ngOnInit() {
		this.crumbs$ = this.privateService.crumbs$;
		if(this.privateService.isAuthenticated()) {
			this.initializePrivateService();
		}
	}

	onSidenavClosed(): void {
		this.layoutService.closeSidenav();
	}

  	onQuickpanelClosed(): void {
		this.layoutService.closeQuickpanel();
	}

	private async initializePrivateService(): Promise<void> {
		try {
			const res: ApiResponse = await this.privateService.fetchUserData();
			this.logService.debug('user', res);
			this.appService.setUser(res.payload.user);
			this.appService.setSetting(res.payload.settings);
			this.initializeConfig();
			this.initializeNavigation();
			this.isLoading = false;
		}
		catch (err: unknown) {
			this.logService.error('user', err);
			this.isLoading = false;
		}
	}

	private async initializeNavigation() {
		try {
			const res: ApiResponse = await this.privateService.fetchNavigationList();
			this.logService.debug('nav', res);
			let navHeading: NavigationSubheading[] = [];
			res.payload.forEach((item: navResponse) => {
				let navLinks: NavigationLink[] = [];
				item.items.forEach((item: navigation) => {
					navLinks.push({ 
						type: 'link',
						label: item.name,
						icon: item.logo,
						route: item.link
					})
				})
				navHeading.push({
					type: 'subheading',
					label: item.header,
					children: navLinks
				});
			})
			this.navigationLoaderService.loadNavigation(navHeading);
		}
		catch (err: unknown) {
			this.logService.error('nav', err);
		}
	}

	private initializeConfig() {
		this.settings = this.appService.currentSetting;
		
		const orientation = this.settings?.orientation == 'left' ? 'ltr' : 'rtl';
		const toolBar = this.settings?.toolBar ? 'Fixed' : 'Static';

		vexConfigs.apollo.style.themeClassName = this.settings?.className;
		vexConfigs.apollo.direction = orientation;
		vexConfigs.apollo.toolbar.fixed = toolBar == 'Fixed' ? true : false;
		vexConfigs.apollo.footer.fixed = this.settings?.footerFixed ? true : false;

		this.configService.updateConfig({
			style: {
				themeClassName: this.settings?.className,
				colorScheme: this.settings?.isDarkMode ? VexColorScheme.DARK : VexColorScheme.LIGHT
			},
			direction: orientation,
			toolbar: {
				fixed: toolBar == 'Fixed' ? true : false
			},
			footer: {
				fixed: this.settings?.footer ? true : false
			}
		});
	}

}
