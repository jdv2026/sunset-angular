import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { LoggerService } from './services/Logger.service';
import { Observable } from 'rxjs';
import { MainLoadingComponent } from './utilities/main-loading/main-loading.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { VagueErrorPageComponent } from './utilities/vague-error-page/vague-error-page.component';

@Component({
	selector: 'vex-root',
	templateUrl: './app.component.html',
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		MainLoadingComponent,
		CommonModule,
		MatTooltipModule,
		MatIconModule,
		VagueErrorPageComponent
	],
})
export class AppComponent implements OnInit {

	isLoading: Observable<boolean>;
	version$: Observable<string>;
	error: boolean = false;
	showContact = false;
	showVersion = false;
	copiedKey: string | null = null;

	copy(key: string, value: string): void {
		navigator.clipboard.writeText(value).then(() => {
			this.copiedKey = key;
			setTimeout(() => this.copiedKey = null, 2000);
		});
	}

	constructor(
		private appService: AppService,
		private logService: LoggerService,
	) {
		this.isLoading = this.appService.loading$;
		this.version$ = this.appService.version$;
	}

	ngOnInit() {
		this.handleAppInitialization();
	}

	private async handleAppInitialization() {
		try {
			const [res] = await Promise.all([
				this.appService.handleAppInitialization(),
				this.appService.fetchBudgetVersion(),
			]);
			this.appService.setMetaData(res.payload);
		}
		catch (err) {
			this.logService.error('app initialization', err);
		}
	}

}
