import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';
import { Transaction, Month } from './transactions.contracts';
import { CATEGORY_COLOR_MAP } from '../categories/categories.contracts';
import { PrivateService } from '../../private.service';

@Component({
	selector: 'vex-transactions',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		MatMenuModule,
		MatDialogModule,
		MatSelectModule,
		MatFormFieldModule,
		FormsModule,
	],
	templateUrl: './transactions.component.html',
	styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {

	displayedColumns: string[] = ['date', 'description', 'category', 'type', 'amount', 'status', 'actions'];

	months: Month[] = [
		{ value: '2026-01', label: 'January 2026' },
		{ value: '2026-02', label: 'February 2026' },
		{ value: '2026-03', label: 'March 2026' },
		{ value: '2026-04', label: 'April 2026' },
		{ value: '2026-05', label: 'May 2026' },
		{ value: '2026-06', label: 'June 2026' },
		{ value: '2026-07', label: 'July 2026' },
		{ value: '2026-08', label: 'August 2026' },
		{ value: '2026-09', label: 'September 2026' },
		{ value: '2026-10', label: 'October 2026' },
		{ value: '2026-11', label: 'November 2026' },
		{ value: '2026-12', label: 'December 2026' },
	];

	selectedMonth: string = '2026-03';

	transactions: Transaction[] = [
		{ id: 1, date: '2026-03-01', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 85.40, status: 'completed' },
		{ id: 2, date: '2026-03-03', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
		{ id: 3, date: '2026-03-05', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, status: 'completed' },
		{ id: 4, date: '2026-03-07', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 120.00, status: 'pending' },
		{ id: 5, date: '2026-03-09', description: 'Freelance Payment', category: 'Income', type: 'income', amount: 450.00, status: 'completed' },
		{ id: 6, date: '2026-03-11', description: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 62.50, status: 'completed' },
		{ id: 7, date: '2026-03-12', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 45.00, status: 'failed' },
	];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.setBreadcrumb();
	}

	get filteredTransactions(): Transaction[] {
		const list = this.selectedMonth
			? this.transactions.filter(t => t.date.startsWith(this.selectedMonth))
			: this.transactions;
		return [...list].sort((a, b) => b.date.localeCompare(a.date));
	}

	get lastIncome(): number {
		const tx = this.filteredTransactions.find(t => t.type === 'income' && t.status === 'completed');
		return tx?.amount ?? 0;
	}

	get lastExpense(): number {
		const tx = this.filteredTransactions.find(t => t.type === 'expense' && t.status === 'completed');
		return tx?.amount ?? 0;
	}

	getCategoryColor(name: string): string {
		return CATEGORY_COLOR_MAP[name] ?? '#64748b';
	}

	openAddTransaction(): void {
		const ref = this.dialog.open(AddTransactionDialogComponent, {
			width: '540px',
		});

		ref.afterClosed().subscribe((result: Omit<Transaction, 'id'> | undefined) => {
			if (!result) return;
			const newTransaction: Transaction = {
				...result,
				id: this.transactions.length + 1,
			};
			this.transactions = [newTransaction, ...this.transactions];
		});
	}

	private setBreadcrumb(): void {
		this.privateService.setCrumbs({
			current: 'Transactions',
			crumbs: ['Budget', 'Transactions'],
		});
	}
	
}
