import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexChartComponent, ApexOptions } from '@vex/components/vex-chart/vex-chart.component';
import { Transaction } from '../transactions/transactions.contracts';
import { CATEGORY_COLOR_MAP } from '../categories/categories.contracts';
import { PrivateService } from '../../private.service';

type ViewMode = 'daily' | 'monthly' | 'yearly';

@Component({
	selector: 'vex-reports',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatButtonToggleModule,
		VexChartComponent,
	],
	templateUrl: './reports.component.html',
	styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

	private readonly transactions: Transaction[] = [
		{ id: 1, date: '2026-01-05', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
		{ id: 2, date: '2026-01-10', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 210.00, status: 'completed' },
		{ id: 3, date: '2026-01-15', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 130.00, status: 'completed' },
		{ id: 4, date: '2026-01-20', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 60.00, status: 'completed' },
		{ id: 5, date: '2026-02-05', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
		{ id: 6, date: '2026-02-08', description: 'Freelance Payment', category: 'Income', type: 'income', amount: 600.00, status: 'completed' },
		{ id: 7, date: '2026-02-12', description: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 95.00, status: 'completed' },
		{ id: 8, date: '2026-02-18', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, status: 'completed' },
		{ id: 9, date: '2026-02-20', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 50.00, status: 'completed' },
		{ id: 10, date: '2026-03-03', description: 'Monthly Salary', category: 'Income', type: 'income', amount: 3500.00, status: 'completed' },
		{ id: 11, date: '2026-03-05', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, status: 'completed' },
		{ id: 12, date: '2026-03-07', description: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 120.00, status: 'completed' },
		{ id: 13, date: '2026-03-09', description: 'Freelance Payment', category: 'Income', type: 'income', amount: 450.00, status: 'completed' },
		{ id: 14, date: '2026-03-11', description: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 62.50, status: 'completed' },
		{ id: 15, date: '2026-03-12', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 85.40, status: 'completed' },
		{ id: 16, date: '2026-03-13T09:00', description: 'Salary Advance', category: 'Income', type: 'income', amount: 1750.00, status: 'completed' },
		{ id: 17, date: '2026-03-13T10:30', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 45.00, status: 'completed' },
		{ id: 18, date: '2026-03-13T11:00', description: 'Coffee Shop', category: 'Food', type: 'expense', amount: 8.50, status: 'completed' },
		{ id: 19, date: '2026-03-13T14:00', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 55.00, status: 'completed' },
	];

	viewMode: ViewMode = 'daily';

	private readonly now = new Date();
	private readonly todayStr = this.now.toISOString().split('T')[0];
	private readonly currentHour = this.now.getHours();

	private get completed(): Transaction[] {
		return this.transactions.filter(t => t.status === 'completed');
	}

	private get viewTransactions(): Transaction[] {
		if (this.viewMode === 'daily') {
			return this.completed.filter(t => t.date.startsWith(this.todayStr));
		}
		if (this.viewMode === 'monthly') {
			const year = String(this.now.getFullYear());
			return this.completed.filter(t => t.date.startsWith(year) && t.date.slice(0, 10) <= this.todayStr);
		}
		return this.completed.filter(t => t.date.slice(0, 10) <= this.todayStr);
	}

	get totalIncome(): number {
		return this.viewTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
	}

	get totalExpenses(): number {
		return this.viewTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
	}

	get balance(): number {
		return this.totalIncome - this.totalExpenses;
	}

	get savingsRate(): number {
		if (this.totalIncome === 0) return 0;
		return Math.round((this.balance / this.totalIncome) * 100);
	}

	get barChartSubtitle(): string {
		const h = String(this.currentHour).padStart(2, '0');
		if (this.viewMode === 'daily') return `Today's transactions by hour, up to ${h}:00`;
		if (this.viewMode === 'monthly') return `Monthly totals for ${this.now.getFullYear()}, year-to-date`;
		return 'Year-to-date totals by year';
	}

	barChartOptions: ApexOptions = {};
	barChartSeries: ApexAxisChartSeries = [];

	donutChartOptions: ApexOptions = {};
	donutChartSeries: number[] = [];

	constructor(private readonly privateService: PrivateService) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Reports', crumbs: ['Budget', 'Reports'] });
		this.buildBarChart();
		this.buildDonutChart();
	}

	onViewModeChange(): void {
		this.buildBarChart();
		this.buildDonutChart();
	}

	private buildBarChart(): void {
		if (this.viewMode === 'daily') {
			this.buildDailyBarChart();
		} else if (this.viewMode === 'monthly') {
			this.buildMonthlyBarChart();
		} else {
			this.buildYearlyBarChart();
		}
	}

	private buildDailyBarChart(): void {
		const hours = Array.from({ length: this.currentHour + 1 }, (_, i) => i);
		const labels = hours.map(h => `${String(h).padStart(2, '0')}:00`);
		const todayTx = this.completed.filter(t => t.date.startsWith(this.todayStr));

		this.barChartSeries = [
			{
				name: 'Income',
				data: hours.map(h =>
					todayTx
						.filter(t => t.type === 'income' && parseInt(t.date.split('T')[1] ?? '0') === h)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
			{
				name: 'Expenses',
				data: hours.map(h =>
					todayTx
						.filter(t => t.type === 'expense' && parseInt(t.date.split('T')[1] ?? '0') === h)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
		];

		this.barChartOptions = this.getBarChartOptions(labels);
	}

	private buildMonthlyBarChart(): void {
		const year = this.now.getFullYear();
		const currentMonth = this.now.getMonth() + 1;
		const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		const months = Array.from({ length: currentMonth }, (_, i) => {
			return `${year}-${String(i + 1).padStart(2, '0')}`;
		});

		this.barChartSeries = [
			{
				name: 'Income',
				data: months.map(m =>
					this.completed
						.filter(t => t.type === 'income' && t.date.startsWith(m) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
			{
				name: 'Expenses',
				data: months.map(m =>
					this.completed
						.filter(t => t.type === 'expense' && t.date.startsWith(m) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
		];

		this.barChartOptions = this.getBarChartOptions(months.map(m => monthLabels[parseInt(m.split('-')[1]) - 1]));
	}

	private buildYearlyBarChart(): void {
		const years = [...new Set(
			this.completed
				.filter(t => t.date.slice(0, 10) <= this.todayStr)
				.map(t => t.date.slice(0, 4))
		)].sort();

		this.barChartSeries = [
			{
				name: 'Income',
				data: years.map(y =>
					this.completed
						.filter(t => t.type === 'income' && t.date.startsWith(y) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
			{
				name: 'Expenses',
				data: years.map(y =>
					this.completed
						.filter(t => t.type === 'expense' && t.date.startsWith(y) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + t.amount, 0)
				),
			},
		];

		this.barChartOptions = this.getBarChartOptions(years);
	}

	private getBarChartOptions(labels: string[]): ApexOptions {
		return {
			chart: { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
			colors: ['#22c55e', '#ef4444'],
			xaxis: { categories: labels, labels: { style: { fontFamily: 'inherit' } } },
			yaxis: { labels: { formatter: (v: number) => `$${v.toLocaleString()}`, style: { fontFamily: 'inherit' } } },
			plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
			dataLabels: { enabled: false },
			legend: { position: 'top', fontFamily: 'inherit' },
			grid: { borderColor: '#f3f4f6' },
			tooltip: { y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
		};
	}

	private buildDonutChart(): void {
		const expensesByCategory: Record<string, number> = {};
		this.viewTransactions.filter(t => t.type === 'expense').forEach(t => {
			expensesByCategory[t.category] = (expensesByCategory[t.category] ?? 0) + t.amount;
		});

		const labels = Object.keys(expensesByCategory);
		const colors = labels.map(l => CATEGORY_COLOR_MAP[l] ?? '#64748b');

		this.donutChartSeries = Object.values(expensesByCategory);

		this.donutChartOptions = {
			chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
			labels,
			colors,
			dataLabels: { enabled: false },
			legend: { position: 'bottom', fontFamily: 'inherit' },
			plotOptions: { pie: { donut: { size: '65%' } } },
			tooltip: { y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
		};
	}
}
