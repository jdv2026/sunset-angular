import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, Router } from '@angular/router';
import { ErrorStateService } from './error-page.service';
import { Location } from '@angular/common';
import { filter, take } from 'rxjs';

@Component({
	selector: 'app-error-page',
	templateUrl: './error-page.component.html',
	styleUrls: ['./error-page.component.scss']
})

export class ErrorPageComponent implements OnInit {
	@Input() status: number = 500;
	@Input() message?: string;

	constructor(
		private readonly location: Location,
		private readonly route: ActivatedRoute,
		private readonly errorPageService: ErrorStateService,
		private readonly router: Router,
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			const code = params.get('status');
			if (code) this.status = +code; 
		});

		this.route.queryParamMap.subscribe(q => {
			const msg = q.get('message');
			if (msg) this.message = msg;
		});
	}

	get title(): string {
		switch (this.status) {
			case 401: return '401 - Unauthorized';
			case 403: return '403 - Forbidden';
			case 404: return '404 - Not Found';
			case 500: return '500 - Internal Server Error';
			default: return `${this.status} - Error`;
		}
	}

	get description(): string {
		const apiError = this.errorPageService.currentApiError;
		if (apiError?.is_custom_message) return apiError.message;
		switch (this.status) {
			case 401: return 'You are not authorized to access this resource.';
			case 403: return 'You do not have permission to access this page.';
			case 404: return 'The page you are looking for does not exist.';
			case 500: return 'Something went wrong on the server.';
			default: return 'An unexpected error occurred.';
		}
	}

	goHome() {
		this.errorPageService.setError(false);
		this.router.navigate(['/dashboard/home']).catch(() => this.location.back());
	}

	goBack() {
		this.errorPageService.setError(false);
		this.router.events.pipe(
			filter(e => e instanceof NavigationEnd || e instanceof NavigationError),
			take(1)
		).subscribe(e => {
			if (e instanceof NavigationError) this.goHome();
		});
		this.location.back();
	}
}
