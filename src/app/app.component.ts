import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { ApiResponse } from './contracts/ApiResponse';
import { LoggerService } from './services/Logger.service';
import { Observable } from 'rxjs';
import { MainLoadingComponent } from './utilities/main-loading/main-loading.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { VagueErrorPageComponent } from './utilities/vague-error-page/vague-error-page.component';
import { MetaDataResponse } from './private/private.contracts';

@Component({
	selector: 'vex-root',
	templateUrl: './app.component.html',
	standalone: true,
	imports: [
		RouterOutlet,
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
			const res: ApiResponse = await this.appService.handleAppInitialization();
			this.appService.setMetaData(res.payload);
		}
		catch (err) {
			this.logService.error('app initialization', err);
		}
	}

}
