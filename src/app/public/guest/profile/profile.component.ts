import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PrivateService } from 'src/app/private/private.service';

@Component({
	selector: 'vex-guest-profile',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class GuestProfileComponent implements OnInit {

	readonly name = 'Jane Doe';
	readonly username = 'guest_user';
	readonly role = 'Guest';
	readonly initials = 'JD';
	readonly memberSince = '2026-01-01T00:00:00.000000Z';

	constructor(private readonly privateService: PrivateService) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Profile', crumbs: ['Profile'] });
	}
}
