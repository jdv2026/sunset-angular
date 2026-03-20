import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Transaction, Month } from './transactions.contracts';
import { AddIncomeDialogComponent } from './add-income-dialog/add-income-dialog.component';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { TransactionsService } from './transactions.service';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SuccessModalComponent } from 'src/app/utilities/success-modal/success-modal.component';
import { ErrorHandlerService } from 'src/app/services/ErrorHandler.service';
import { PrivateService } from '../../private.service';

@Component({
	selector: 'vex-transactions',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatDialogModule,
		MatSelectModule,
		MatFormFieldModule,
		MatPaginatorModule,
		FormsModule,
	],
	templateUrl: './transactions.component.html',
	styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {

	readonly Math = Math;

	displayedColumns: string[] = ['date', 'description', 'type', 'wallet', 'goal', 'bill'];

	transactions: Transaction[] = [];
	totalItems = 0;
	pageSize = 10;
	pageIndex = 0;

	balance = 0;
	totalIncome = 0;
	totalExpense = 0;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	years: string[] = ['2024', '2025', '2026'];

	months: Month[] = [
		{ value: '01', label: 'January' },
		{ value: '02', label: 'February' },
		{ value: '03', label: 'March' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'May' },
		{ value: '06', label: 'June' },
		{ value: '07', label: 'July' },
		{ value: '08', label: 'August' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'October' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'December' },
	];

	selectedYear: string = '2026';
	selectedMonth: string = '03';

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
		private readonly transactionsService: TransactionsService,
		private readonly errorHandler: ErrorHandlerService,
	) {}

	ngOnInit(): void {
		this.setBreadcrumb();
		this.initActiveTransactions();
	}

onPageChange(event: PageEvent): void {
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
		this.initActiveTransactions();
	}

	openAddIncome(): void {
		const ref = this.dialog.open(AddIncomeDialogComponent, {
			width: '480px',
			disableClose: true,
		});

		ref.afterClosed().subscribe(async (result: any | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.transactionsService.storeTransactionIncome({ payload: result } as any);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Income Added', message: 'Income transaction has been saved successfully.' }] },
					width: '400px',
				});
				this.initActiveTransactions();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Save', err);
			}
		});
	}

	openAddExpense(): void {
		const ref = this.dialog.open(AddExpenseDialogComponent, {
			width: '480px',
			disableClose: true,
		});

		ref.afterClosed().subscribe(async (result: any | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				if (result.action === 'pay') {
					await this.transactionsService.storeTransactionPay({ payload: result } as any);
					loadingRef.close();
					this.dialog.open(SuccessModalComponent, {
						data: { items: [{ header: 'Payment Saved', message: 'Bill payment has been saved successfully.' }] },
						width: '400px',
					});
					this.initActiveTransactions();
				} else {
					await this.transactionsService.storeTransactionTransfer({ payload: result } as any);
					loadingRef.close();
					this.dialog.open(SuccessModalComponent, {
						data: { items: [{ header: 'Transfer Saved', message: 'Transfer has been saved successfully.' }] },
						width: '400px',
					});
					this.initActiveTransactions();
				}
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Save', err);
			}
		});
	}

	async initActiveTransactions(): Promise<void> {
		try {
			const res = await this.transactionsService.fetchActiveTransactions({
				year: this.selectedYear || undefined,
				month: this.selectedMonth || undefined,
				page: this.pageIndex + 1,
				per_page: this.pageSize,
			});
			this.balance = res.payload.balance ?? 0;
			this.totalIncome = res.payload.total_income ?? 0;
			this.totalExpense = res.payload.total_expense ?? 0;
			this.transactions = res.payload.transactions.data.map((item: any) => ({
				id: item.id,
				date: item.date,
				description: item.description,
				category: item.category,
				type: item.type,
				wallet: item.wallet_amount ?? null,
				goal: item.goal_saved ?? null,
				bill: item.bill_paid ?? null,
				status: item.status,
			}));
			this.totalItems = res.payload.transactions.total;
		} catch (err: unknown) {
			this.errorHandler.open('Failed to Load', err);
		}
	}

	private setBreadcrumb(): void {
		this.privateService.setCrumbs({
			current: 'Transactions',
			crumbs: ['Budget', 'Transactions'],
		});
	}

}
