import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PrivateService } from 'src/app/private/private.service';

const ROUTE_CRUMBS: Record<string, { header: string; name: string }> = {
	'physical/overview':       { header: 'Physical Focus', name: 'Overview' },
	'physical/workouts':       { header: 'Physical Focus', name: 'Workouts' },
	'physical/program':        { header: 'Physical Focus', name: 'Program' },
	'physical/progress-report':{ header: 'Physical Focus', name: 'Progress Report' },
	'physical/schedule':       { header: 'Physical Focus', name: 'Schedule' },
};

@Component({
	selector: 'vex-under-construction',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './under-construction.component.html',
	styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent implements OnInit {

	constructor(
		private readonly router: Router,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		const url = this.router.url.replace(/^\/(dashboard|guest)\//, '');
		const match = ROUTE_CRUMBS[url];
		if (match) {
			this.privateService.setCrumbs({ current: match.name, crumbs: [match.header, match.name] });
		}
	}
}
