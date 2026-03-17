import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BillDialogComponent } from './bill-dialog/bill-dialog.component';
import { Bill, BillDialogData } from './bills.contracts';
import { PrivateService } from '../../private.service';
import { BillsService } from './bills.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.contracts';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SuccessModalComponent } from 'src/app/utilities/success-modal/success-modal.component';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { ErrorHandlerService } from 'src/app/services/ErrorHandler.service';

@Component({
	selector: 'vex-bills',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
		MatTooltipModule,
		ConfirmationDialogComponent,
	],
	templateUrl: './bills.component.html',
	styleUrl: './bills.component.scss',
})
export class BillsComponent implements OnInit {

	bills: Bill[] = [];

	categories: Category[] = [];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
		private readonly billsService: BillsService,
		private readonly categoriesService: CategoriesService,
		private readonly errorHandler: ErrorHandlerService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Bills', crumbs: ['Budget', 'Bills'] });
		this.initCategories();
		this.initActiveBills();
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
			return a.due_date.localeCompare(b.due_date);
		});
	}

	getCategoryFor(bill: Bill): Category | undefined {
		return this.categories.find(c => c.id === bill.category_id);
	}

	getDaysUntilDue(due_date: string): number {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const due = new Date(due_date);
		return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	getDueDateLabel(bill: Bill): string {
		if (bill.status === 'paid') return 'Paid';
		const days = this.getDaysUntilDue(bill.due_date);
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
		const data: BillDialogData = { categories: this.categories };
		const ref = this.dialog.open(BillDialogComponent, { width: '90vw', maxWidth: '480px', data });
		ref.afterClosed().subscribe(async (result: Omit<Bill, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.billsService.storeBill({ payload: result } as any);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Bill Created', message: `"${result.name}" has been added successfully.` }] },
					width: '400px',
				});
				this.initActiveBills();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Create', err);
			}
		});
	}

	openEdit(bill: Bill): void {
		const data: BillDialogData = { bill, categories: this.categories };
		const ref = this.dialog.open(BillDialogComponent, { width: '90vw', maxWidth: '480px', data });
		ref.afterClosed().subscribe(async (result: Omit<Bill, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.billsService.updateBill(bill.id, result);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Bill Updated', message: `"${result.name}" has been updated successfully.` }] },
					width: '400px',
				});
				this.initActiveBills();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Update', err);
			}
		});
	}

	delete(bill: Bill): void {
		const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '400px',
			data: {
				warning: true,
				items: [{
					header: 'Delete Bill',
					message: `Are you sure you want to delete "${bill.name}"?`,
					description: 'This will permanently delete this bill and all its data.',
				}],
			},
		});
		confirmRef.afterClosed().subscribe(async (confirmed: boolean) => {
			if (!confirmed) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Deleting', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.billsService.deleteBill(bill.id);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Bill Deleted', message: `"${bill.name}" has been deleted successfully.` }] },
					width: '400px',
				});
				this.bills = this.bills.filter(b => b.id !== bill.id);
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Delete', err);
			}
		});
	}

	private async initActiveBills(): Promise<void> {
		try {
			const res = await this.billsService.fetchActiveBills();
			this.bills = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				amount: item.amount,
				due_date: item.due_date,
				frequency: item.frequency,
				status: item.status,
				category_id: item.category_id,
			}));
		} catch (err: unknown) {
			this.errorHandler.open('Failed to Load', err);
		}
	}

	private async initCategories(): Promise<void> {
		try {
			const res = await this.categoriesService.fetchActiveCategories();
			this.categories = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				icon: item.icon,
				color: item.color,
				description: item.description,
			}));
		} 
		catch {

		}
	}
	
}
