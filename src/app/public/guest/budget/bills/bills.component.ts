import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { BillDialogComponent } from './bill-dialog/bill-dialog.component';
import { Bill, BillDialogData } from './bills.contracts';
import { PrivateService } from 'src/app/private/private.service';

@Component({
	selector: 'vex-bills',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
	],
	templateUrl: './bills.component.html',
	styleUrl: './bills.component.scss',
})
export class BillsComponent implements OnInit {

	bills: Bill[] = [
		{ id: 1, name: 'Rent', icon: 'home', color: '#3b82f6', amount: 1200.00, dueDate: '2026-03-01', frequency: 'monthly', status: 'paid', category: 'Housing' },
		{ id: 2, name: 'Netflix', icon: 'tv', color: '#ef4444', amount: 15.99, dueDate: '2026-03-05', frequency: 'monthly', status: 'paid', category: 'Entertainment' },
		{ id: 3, name: 'Electric Bill', icon: 'bolt', color: '#f59e0b', amount: 120.00, dueDate: '2026-03-07', frequency: 'monthly', status: 'paid', category: 'Utilities' },
		{ id: 4, name: 'Internet', icon: 'wifi', color: '#06b6d4', amount: 60.00, dueDate: '2026-03-10', frequency: 'monthly', status: 'paid', category: 'Utilities' },
		{ id: 5, name: 'Gym Membership', icon: 'fitness_center', color: '#10b981', amount: 50.00, dueDate: '2026-03-15', frequency: 'monthly', status: 'upcoming', category: 'Health' },
		{ id: 6, name: 'Car Insurance', icon: 'directions_car', color: '#f97316', amount: 200.00, dueDate: '2026-03-10', frequency: 'monthly', status: 'overdue', category: 'Insurance' },
		{ id: 7, name: 'Spotify', icon: 'subscriptions', color: '#22c55e', amount: 9.99, dueDate: '2026-03-25', frequency: 'monthly', status: 'upcoming', category: 'Entertainment' },
		{ id: 8, name: 'Cloud Storage', icon: 'cloud', color: '#8b5cf6', amount: 2.99, dueDate: '2026-03-28', frequency: 'monthly', status: 'upcoming', category: 'Subscriptions' },
	];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Bills', crumbs: ['Budget', 'Bills'] });
	}

	get totalMonthly(): number {
		return this.bills.filter(b => b.frequency === 'monthly').reduce((s, b) => s + b.amount, 0);
	}

	get totalPaid(): number {
		return this.bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
	}

	get upcomingCount(): number {
		return this.bills.filter(b => b.status === 'upcoming').length;
	}

	get overdueCount(): number {
		return this.bills.filter(b => b.status === 'overdue').length;
	}

	get sortedBills(): Bill[] {
		const order: Record<string, number> = { overdue: 0, upcoming: 1, paid: 2 };
		return [...this.bills].sort((a, b) => {
			const statusDiff = order[a.status] - order[b.status];
			if (statusDiff !== 0) return statusDiff;
			return a.dueDate.localeCompare(b.dueDate);
		});
	}

	getDaysUntilDue(dueDate: string): number {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const due = new Date(dueDate);
		return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	getDueDateLabel(bill: Bill): string {
		if (bill.status === 'paid') return 'Paid';
		const days = this.getDaysUntilDue(bill.dueDate);
		if (days < 0) return `${Math.abs(days)}d overdue`;
		if (days === 0) return 'Due today';
		if (days === 1) return 'Due tomorrow';
		return `Due in ${days}d`;
	}

	markPaid(bill: Bill): void {
		const idx = this.bills.findIndex(b => b.id === bill.id);
		if (idx !== -1) this.bills[idx] = { ...this.bills[idx], status: 'paid' };
	}

	openAdd(): void {
		const ref = this.dialog.open(BillDialogComponent, { width: '480px' });
		ref.afterClosed().subscribe((result: Omit<Bill, 'id'> | undefined) => {
			if (!result) return;
			this.bills.push({ ...result, id: this.bills.length + 1 });
		});
	}

	openEdit(bill: Bill): void {
		const data: BillDialogData = { bill };
		const ref = this.dialog.open(BillDialogComponent, { width: '480px', data });
		ref.afterClosed().subscribe((result: Omit<Bill, 'id'> | undefined) => {
			if (!result) return;
			const idx = this.bills.findIndex(b => b.id === bill.id);
			if (idx !== -1) this.bills[idx] = { ...this.bills[idx], ...result };
		});
	}

	delete(id: number): void {
		this.bills = this.bills.filter(b => b.id !== id);
	}
}
