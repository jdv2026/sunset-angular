import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VexChartComponent, ApexOptions } from '@vex/components/vex-chart/vex-chart.component';
import { Transaction } from '../transactions/transactions.contracts';
import { Category, CATEGORY_COLOR_MAP } from '../categories/categories.contracts';

type CategoryOverview = Pick<Category, 'id' | 'name' | 'icon' | 'color'> & { budget: number; spent: number };
import { Goal } from '../goals/goals.contracts';
import { Bill } from '../bills/bills.contracts';
import { PrivateService } from '../../private.service';

@Component({
	selector: 'vex-overview',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatIconModule,
		MatButtonModule,
		VexChartComponent,
	],
	templateUrl: './overview.component.html',
	styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {

	private readonly currentMonth = '2026-03';

	private readonly transactions: Transaction[] = [
		{ id: 1, date: '2026-03-03', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
		{ id: 2, date: '2026-03-05', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, status: 'completed' },
		{ id: 3, date: '2026-03-07', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 120.00, status: 'completed' },
		{ id: 4, date: '2026-03-09', description: 'Freelance Payment', category: 'Income', type: 'income', amount: 450.00, status: 'completed' },
		{ id: 5, date: '2026-03-11', description: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 62.50, status: 'completed' },
		{ id: 6, date: '2026-03-12', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 85.40, status: 'completed' },
		{ id: 7, date: '2026-03-13', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 55.00, status: 'completed' },
	];

	readonly categories: CategoryOverview[] = [
		{ id: 1, name: 'Food', icon: 'restaurant', color: '#f97316', budget: 500, spent: 147.90 },
		{ id: 2, name: 'Transport', icon: 'directions_car', color: '#3b82f6', budget: 200, spent: 55.00 },
		{ id: 3, name: 'Utilities', icon: 'bolt', color: '#8b5cf6', budget: 300, spent: 120.00 },
		{ id: 4, name: 'Entertainment', icon: 'movie', color: '#ec4899', budget: 150, spent: 15.99 },
		{ id: 5, name: 'Health', icon: 'favorite', color: '#10b981', budget: 250, spent: 0 },
	];

	readonly goals: Goal[] = [
		{ id: 1, name: 'Emergency Fund', target: 10000, saved: 3500, deadline: '2026-12-31' },
		{ id: 2, name: 'Vacation', target: 2500, saved: 800, deadline: '2026-07-01' },
		{ id: 3, name: 'New Laptop', target: 1200, saved: 600, deadline: '2026-05-01' },
	];

	readonly bills: Bill[] = [
		{ id: 1, name: 'Rent', icon: 'home', color: '#3b82f6', amount: 1200.00, dueDate: '2026-03-01', frequency: 'monthly', status: 'paid', category: 'Housing' },
		{ id: 5, name: 'Gym Membership', icon: 'fitness_center', color: '#10b981', amount: 50.00, dueDate: '2026-03-15', frequency: 'monthly', status: 'upcoming', category: 'Health' },
		{ id: 6, name: 'Car Insurance', icon: 'directions_car', color: '#f97316', amount: 200.00, dueDate: '2026-03-10', frequency: 'monthly', status: 'overdue', category: 'Insurance' },
		{ id: 7, name: 'Spotify', icon: 'subscriptions', color: '#22c55e', amount: 9.99, dueDate: '2026-03-25', frequency: 'monthly', status: 'upcoming', category: 'Entertainment' },
		{ id: 8, name: 'Cloud Storage', icon: 'cloud', color: '#8b5cf6', amount: 2.99, dueDate: '2026-03-28', frequency: 'monthly', status: 'upcoming', category: 'Subscriptions' },
	];

	// Summary
	private get monthlyCompleted(): Transaction[] {
		return this.transactions.filter(t => t.date.startsWith(this.currentMonth) && t.status === 'completed');
	}

	get totalIncome(): number {
		return this.monthlyCompleted.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
	}

	get totalExpenses(): number {
		return this.monthlyCompleted.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
	}

	get netBalance(): number {
		return this.totalIncome - this.totalExpenses;
	}

	get savingsRate(): number {
		if (this.totalIncome === 0) return 0;
		return Math.round((this.netBalance / this.totalIncome) * 100);
	}

	// Recent transactions
	get recentTransactions(): Transaction[] {
		return [...this.transactions]
			.sort((a, b) => b.date.localeCompare(a.date))
			.slice(0, 5);
	}

	// Top categories by spent
	get topCategories(): CategoryOverview[] {
		return [...this.categories]
			.filter(c => c.spent > 0)
			.sort((a, b) => b.spent - a.spent)
			.slice(0, 4);
	}

	getCategoryProgress(cat: CategoryOverview): number {
		if (cat.budget === 0) return 0;
		return Math.min((cat.spent / cat.budget) * 100, 100);
	}

	getCategoryProgressColor(cat: CategoryOverview): string {
		const pct = this.getCategoryProgress(cat);
		if (pct >= 90) return '#ef4444';
		if (pct >= 70) return '#f59e0b';
		return cat.color;
	}

	// Upcoming bills (non-paid, sorted soonest first)
	get upcomingBills(): Bill[] {
		return [...this.bills]
			.filter(b => b.status !== 'paid')
			.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
			.slice(0, 4);
	}

	getDueDateLabel(bill: Bill): string {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const due = new Date(bill.dueDate);
		const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		if (days < 0) return `${Math.abs(days)}d overdue`;
		if (days === 0) return 'Due today';
		if (days === 1) return 'Due tomorrow';
		return `Due in ${days}d`;
	}

	// Goals (top 3 in progress)
	get activeGoals(): Goal[] {
		return [...this.goals]
			.filter(g => g.saved < g.target)
			.sort((a, b) => (b.saved / b.target) - (a.saved / a.target))
			.slice(0, 3);
	}

	getGoalProgress(goal: Goal): number {
		if (goal.target === 0) return 0;
		return Math.min((goal.saved / goal.target) * 100, 100);
	}

	// Chart
	spendingChartOptions: ApexOptions = {};
	spendingChartSeries: ApexAxisChartSeries = [];

	getCategoryColor(name: string): string {
		return CATEGORY_COLOR_MAP[name] ?? '#64748b';
	}

	constructor(private readonly privateService: PrivateService) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Overview', crumbs: ['Budget', 'Overview'] });
		this.buildSpendingChart();
	}

	private buildSpendingChart(): void {
		const monthLabels = ['Jan', 'Feb', 'Mar'];
		const months = ['2026-01', '2026-02', '2026-03'];

		const allTx: Transaction[] = [
			{ id: 101, date: '2026-01-05', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
			{ id: 102, date: '2026-01-10', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 210.00, status: 'completed' },
			{ id: 103, date: '2026-01-15', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 130.00, status: 'completed' },
			{ id: 104, date: '2026-01-20', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 60.00, status: 'completed' },
			{ id: 105, date: '2026-02-05', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
			{ id: 106, date: '2026-02-08', description: 'Freelance Payment', category: 'Income', type: 'income', amount: 600.00, status: 'completed' },
			{ id: 107, date: '2026-02-12', description: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 95.00, status: 'completed' },
			{ id: 108, date: '2026-02-18', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, status: 'completed' },
			{ id: 109, date: '2026-02-20', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 50.00, status: 'completed' },
			...this.transactions,
		];

		const completed = allTx.filter(t => t.status === 'completed');

		this.spendingChartSeries = [
			{
				name: 'Income',
				data: months.map(m => completed.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0)),
			},
			{
				name: 'Expenses',
				data: months.map(m => completed.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0)),
			},
		];

		this.spendingChartOptions = {
			chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
			colors: ['#22c55e', '#ef4444'],
			xaxis: { categories: monthLabels, labels: { style: { fontFamily: 'inherit' } } },
			yaxis: { labels: { formatter: (v: number) => `$${v.toLocaleString()}`, style: { fontFamily: 'inherit' } } },
			plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
			dataLabels: { enabled: false },
			legend: { position: 'top', fontFamily: 'inherit' },
			grid: { borderColor: '#f3f4f6' },
			tooltip: { y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
		};
	}
}
