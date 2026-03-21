import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';
import { Goal, GoalDialogData } from './goals.contracts';
import { PrivateService } from '../../private.service';
import { GoalsService } from './goals.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.contracts';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SuccessModalComponent } from 'src/app/utilities/success-modal/success-modal.component';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { ErrorHandlerService } from 'src/app/services/ErrorHandler.service';

@Component({
	selector: 'vex-goals',
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
	templateUrl: './goals.component.html',
	styleUrl: './goals.component.scss',
})
export class GoalsComponent implements OnInit {

	goals: Goal[] = [];
	categories: Category[] = [];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
		private readonly goalsService: GoalsService,
		private readonly categoriesService: CategoriesService,
		private readonly errorHandler: ErrorHandlerService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Goals', crumbs: ['Budget', 'Goals'] });
		this.initActiveGoals();
		this.initCategories();
	}

	get totalSaved(): number {
		return this.goals.reduce((s, g) => s + g.saved, 0);
	}

	get totalTarget(): number {
		return this.goals.reduce((s, g) => s + g.amount, 0);
	}

	getProgress(goal: Goal): number {
		if (goal.amount === 0) return 0;
		return Math.min((goal.saved / goal.amount) * 100, 100);
	}

	expandedDescriptions = new Set<number>();

	toggleDescription(id: number): void {
		this.expandedDescriptions.has(id) ? this.expandedDescriptions.delete(id) : this.expandedDescriptions.add(id);
	}

	getCategoryFor(goal: Goal): Category | undefined {
		return this.categories.find(c => c.id === goal.category_id);
	}

	getProgressColor(goal: Goal): string {
		const pct = this.getProgress(goal);
		if (pct >= 100) return '#22c55e';
		if (pct >= 60) return this.getCategoryFor(goal)?.color ?? '#22c55e';
		if (pct >= 30) return '#f59e0b';
		return '#ef4444';
	}

	getDaysLeft(deadline: string): number {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const end = new Date(deadline);
		return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	getMonthlySavingsNeeded(goal: Goal): number {
		const remaining = goal.amount - goal.saved;
		if (remaining <= 0) return 0;
		const daysLeft = this.getDaysLeft(goal.deadline);
		const monthsLeft = Math.max(daysLeft / 30, 1);
		return remaining / monthsLeft;
	}

	openAdd(): void {
		const data: GoalDialogData = { categories: this.categories };
		const ref = this.dialog.open(GoalDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true, data });
		ref.afterClosed().subscribe(async (result: Omit<Goal, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			
			try {
				await this.goalsService.storeGoal({ payload: result } as any);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Goal Created', message: `"${result.name}" has been added successfully.` }] },
					width: '400px',
				});
				this.initActiveGoals();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Create', err);
			}
		});
	}

	openEdit(goal: Goal): void {
		const data: GoalDialogData = { goal, categories: this.categories };
		const ref = this.dialog.open(GoalDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true, data });
		ref.afterClosed().subscribe(async (result: Omit<Goal, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.goalsService.updateGoal(goal.id, result);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Goal Updated', message: `"${result.name}" has been updated successfully.` }] },
					width: '400px',
				});
				this.initActiveGoals();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Update', err);
			}
		});
	}

	delete(goal: Goal): void {
		const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '400px',
			data: {
				warning: true,
				items: [{
					header: 'Delete Goal',
					message: `Are you sure you want to delete "${goal.name}"?`,
					description: 'This will permanently delete this goal and all its data.',
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
				await this.goalsService.deleteGoal(goal.id);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Goal Deleted', message: `"${goal.name}" has been deleted successfully.` }] },
					width: '400px',
				});
				this.goals = this.goals.filter(g => g.id !== goal.id);
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Delete', err);
			}
		});
	}

	private async initActiveGoals(): Promise<void> {
		try {
			const res = await this.goalsService.fetchActiveGoals();
			this.goals = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				amount: item.amount,
				saved: item.saved,
				deadline: item.deadline,
				category_id: item.category_id,
			}));
		} catch (err: unknown) {
			this.errorHandler.open('Failed to Load', err);
		}
	}

	private async initCategories(): Promise<void> {
		try {
			const res = await this.categoriesService.fetchActiveCategoriesForGoals();
			this.categories = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				icon: item.icon,
				color: item.color,
				description: item.description,
			}));
		} catch (err: unknown) {
			this.errorHandler.open('Failed to Load Categories', err);
		}
	}
	
}
