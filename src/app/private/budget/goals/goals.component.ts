import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';
import { Goal, GoalDialogData } from './goals.contracts';
import { PrivateService } from '../../private.service';

@Component({
	selector: 'vex-goals',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
	],
	templateUrl: './goals.component.html',
	styleUrl: './goals.component.scss',
})
export class GoalsComponent implements OnInit {

	goals: Goal[] = [
		{ id: 1, name: 'Emergency Fund', icon: 'savings', color: '#22c55e', target: 10000, saved: 3500, deadline: '2026-12-31' },
		{ id: 2, name: 'Vacation', icon: 'flight', color: '#3b82f6', target: 2500, saved: 800, deadline: '2026-07-01' },
		{ id: 3, name: 'New Laptop', icon: 'laptop', color: '#8b5cf6', target: 1200, saved: 600, deadline: '2026-05-01' },
		{ id: 4, name: 'Car Down Payment', icon: 'directions_car', color: '#f97316', target: 5000, saved: 1250, deadline: '2026-09-30' },
	];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Goals', crumbs: ['Budget', 'Goals'] });
	}

	getProgress(goal: Goal): number {
		if (goal.target === 0) return 0;
		return Math.min((goal.saved / goal.target) * 100, 100);
	}

	getProgressColor(goal: Goal): string {
		const pct = this.getProgress(goal);
		if (pct >= 100) return '#22c55e';
		if (pct >= 60) return goal.color;
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
		const remaining = goal.target - goal.saved;
		if (remaining <= 0) return 0;
		const daysLeft = this.getDaysLeft(goal.deadline);
		const monthsLeft = Math.max(daysLeft / 30, 1);
		return remaining / monthsLeft;
	}

	openAdd(): void {
		const ref = this.dialog.open(GoalDialogComponent, { width: '480px' });
		ref.afterClosed().subscribe((result: Omit<Goal, 'id'> | undefined) => {
			if (!result) return;
			this.goals.push({ ...result, id: this.goals.length + 1 });
		});
	}

	openEdit(goal: Goal): void {
		const data: GoalDialogData = { goal };
		const ref = this.dialog.open(GoalDialogComponent, { width: '480px', data });
		ref.afterClosed().subscribe((result: Omit<Goal, 'id'> | undefined) => {
			if (!result) return;
			const idx = this.goals.findIndex(g => g.id === goal.id);
			if (idx !== -1) this.goals[idx] = { ...this.goals[idx], ...result };
		});
	}

	get totalSaved(): number {
		return this.goals.reduce((s, g) => s + g.saved, 0);
	}

	get totalTarget(): number {
		return this.goals.reduce((s, g) => s + g.target, 0);
	}

	delete(id: number): void {
		this.goals = this.goals.filter(g => g.id !== id);
	}
}
