import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from 'src/app/app.service';
import { PrivateService } from '../private.service';
import { User } from 'src/app/public/login/login.contract';

@Component({
	selector: 'vex-profile',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

	user: User | null = null;

	constructor(
		private readonly appService: AppService,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.user = this.appService.currentUser;
		this.privateService.setCrumbs({ current: 'Profile', crumbs: ['Profile'] });
	}

	get fullName(): string {
		if (!this.user) return 'Not Available';
		const first = this.user.first_name ?? '';
		const last = this.user.last_name ?? '';
		return (first + ' ' + last).trim() || 'Not Available';
	}

	get initials(): string {
		if (!this.user) return '?';
		const first = this.user.first_name?.charAt(0) ?? '';
		const last = this.user.last_name?.charAt(0) ?? '';
		return (first + last).toUpperCase() || '?';
	}
}
