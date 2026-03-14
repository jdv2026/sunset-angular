import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppService } from 'src/app/app.service';
import { PrivateService } from 'src/app/private/private.service';
import { User } from '@ngneat/falso';

interface QuickLink {
	label: string;
	description: string;
	icon: string;
	color: string;
	route: string;
}

interface ActivityItem {
	icon: string;
	color: string;
	title: string;
	subtitle: string;
	time: string;
}

@Component({
	selector: 'vex-home',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

	user: User | null = null;

	readonly today = new Date();

	readonly quickLinks: QuickLink[] = [
		{ label: 'Overview', description: 'Monthly financial snapshot', icon: 'dashboard', color: '#3b82f6', route: '/guest/budget/overview' },
		{ label: 'Transactions', description: 'Track income & expenses', icon: 'receipt_long', color: '#22c55e', route: '/guest/budget/transactions' },
		{ label: 'Categories', description: 'Manage spending categories', icon: 'category', color: '#f97316', route: '/guest/budget/categories' },
		{ label: 'Reports', description: 'Charts & financial insights', icon: 'bar_chart', color: '#8b5cf6', route: '/guest/budget/reports' },
		{ label: 'Goals', description: 'Track savings milestones', icon: 'savings', color: '#10b981', route: '/guest/budget/goals' },
		{ label: 'Bills', description: 'Manage recurring bills', icon: 'payments', color: '#ec4899', route: '/guest/budget/bills' },
	];

	readonly recentActivity: ActivityItem[] = [
		{ icon: 'arrow_downward', color: '#22c55e', title: 'Salary Advance received', subtitle: 'Income · Today', time: '09:00' },
		{ icon: 'arrow_upward', color: '#ef4444', title: 'Grocery Store', subtitle: 'Food · Today', time: '10:30' },
		{ icon: 'arrow_upward', color: '#ef4444', title: 'Gas Station', subtitle: 'Transport · Today', time: '14:00' },
		{ icon: 'check_circle', color: '#3b82f6', title: 'Electric Bill paid', subtitle: 'Bills · Yesterday', time: '11:00' },
		{ icon: 'flag', color: '#8b5cf6', title: 'New Laptop goal at 50%', subtitle: 'Goals · Mar 12', time: '' },
	];

	get greeting(): string {
		const h = this.today.getHours();
		if (h < 12) return 'Good morning';
		if (h < 17) return 'Good afternoon';
		return 'Good evening';
	}

	get firstName(): string {
		return 'Guest';
	}

	get dateLabel(): string {
		return this.today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	constructor(
		private readonly appService: AppService,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Home', crumbs: ['Home'] });
	}
}
