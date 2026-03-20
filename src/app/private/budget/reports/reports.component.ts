import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexChartComponent, ApexOptions } from '@vex/components/vex-chart/vex-chart.component';
import { Transaction } from '../transactions/transactions.contracts';
import { PrivateService } from '../../private.service';
import { ReportsService } from './reports.service';

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

	private readonly now = new Date();
	private readonly todayStr = this.now.toISOString().split('T')[0];

	private transactions_income_expense: Transaction[] = [];

	viewMode: ViewMode = 'daily';

	totalIncome = 0;
	totalExpenses = 0;
	balance = 0;
	savingsRate = 0;

	barChartOptions: ApexOptions = {};
	barChartSeries: ApexAxisChartSeries = [];

	donutChartOptions: ApexOptions = {};
	donutChartSeries: number[] = [];

	incomeDonutChartOptions: ApexOptions = {};
	incomeDonutChartSeries: number[] = [];

	constructor(
		private readonly privateService: PrivateService,
		private readonly reportsService: ReportsService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Reports', crumbs: ['Budget', 'Reports'] });
		this.loadReport();
	}

	onViewModeChange(): void {
		this.loadReport();
	}

	get barChartSubtitle(): string {
		if (this.viewMode === 'daily') {
			const monthName = this.now.toLocaleString('default', { month: 'long' });
			return `Daily income vs expenses for ${monthName} ${this.now.getFullYear()}`;
		}
		if (this.viewMode === 'monthly') return `Monthly totals for ${this.now.getFullYear()}, year-to-date`;
		return 'Year-to-date totals by year';
	}

	private async loadReport(): Promise<void> {
		try {
			const res = await this.reportsService.fetchActiveReport({ view: this.viewMode });
			const payload = res.payload;

			this.totalIncome = payload.total_income ?? 0;
			this.totalExpenses = payload.total_expense ?? 0;
			this.balance = payload.balance ?? 0;
			this.savingsRate = Math.round(payload.savings_rate ?? 0);

			this.transactions_income_expense = (payload.transactions_income_expense ?? []).map((item: any) => ({
				id: item.id,
				date: item.date,
				description: item.description,
				category: item.category,
				type: item.type,
				wallet: item.wallet ?? null,
				wallet_name: item.wallet_name ?? null,
				wallet_color: item.wallet_color ?? null,
				goal: item.goal ?? null,
				goal_name: item.goal_name ?? null,
				goal_color: item.goal_color ?? null,
				bill: item.bill ?? null,
				bill_name: item.bill_name ?? null,
				bill_color: item.bill_color ?? null,
				status: item.status,
			}));

			this.buildBarChart();
			this.buildDonutChart();
			this.buildIncomeDonutChart();
		} catch {
			// keep charts empty on error
		}
	}

	private buildBarChart(): void {
		if (this.viewMode === 'daily') {
			this.buildDailyLineChart();
		} else if (this.viewMode === 'monthly') {
			this.buildMonthlyBarChart();
		} else {
			this.buildYearlyBarChart();
		}
	}

	private buildDailyLineChart(): void {
		const year = this.now.getFullYear();
		const month = this.now.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const todayDay = this.now.getDate();
		const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

		const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
		const labels = days.map(d => String(d));

		const monthTx = this.transactions_income_expense.filter(t => t.date.startsWith(monthPrefix));

		this.barChartSeries = [
			{
				name: 'Income',
				data: days.map(d => {
					if (d > todayDay) return null as unknown as number;
					const dayStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
					return monthTx
						.filter(t => t.type === 'income' && t.date.startsWith(dayStr))
						.reduce((s, t) => s + (t.wallet ?? 0) + (t.goal ?? 0), 0);
				}),
			},
			{
				name: 'Expenses',
				data: days.map(d => {
					if (d > todayDay) return null as unknown as number;
					const dayStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
					return monthTx
						.filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
						.reduce((s, t) => s + (t.bill ?? 0), 0);
				}),
			},
		];

		this.barChartOptions = this.getLineChartOptions(labels);
	}

	private buildMonthlyBarChart(): void {
		const year = this.now.getFullYear();
		const currentMonth = this.now.getMonth() + 1;
		const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		const months = Array.from({ length: currentMonth }, (_, i) =>
			`${year}-${String(i + 1).padStart(2, '0')}`
		);

		this.barChartSeries = [
			{
				name: 'Income',
				data: months.map(m =>
					this.transactions_income_expense
						.filter(t => t.type === 'income' && t.date.startsWith(m) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + (t.wallet ?? 0) + (t.goal ?? 0), 0)
				),
			},
			{
				name: 'Expenses',
				data: months.map(m =>
					this.transactions_income_expense
						.filter(t => t.type === 'expense' && t.date.startsWith(m) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + (t.bill ?? 0), 0)
				),
			},
		];

		this.barChartOptions = this.getBarChartOptions(months.map(m => monthLabels[parseInt(m.split('-')[1]) - 1]));
	}

	private buildYearlyBarChart(): void {
		const years = [...new Set(
			this.transactions_income_expense
				.filter(t => t.date.slice(0, 10) <= this.todayStr)
				.map(t => t.date.slice(0, 4))
		)].sort();

		this.barChartSeries = [
			{
				name: 'Income',
				data: years.map(y =>
					this.transactions_income_expense
						.filter(t => t.type === 'income' && t.date.startsWith(y) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + (t.wallet ?? 0) + (t.goal ?? 0), 0)
				),
			},
			{
				name: 'Expenses',
				data: years.map(y =>
					this.transactions_income_expense
						.filter(t => t.type === 'expense' && t.date.startsWith(y) && t.date.slice(0, 10) <= this.todayStr)
						.reduce((s, t) => s + (t.bill ?? 0), 0)
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

	private getLineChartOptions(labels: string[]): ApexOptions {
		const every5 = (_val: string, index: number) => (index % 5 === 0 ? labels[index] : '');
		return {
			chart: { type: 'line', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
			colors: ['#22c55e', '#ef4444'],
			xaxis: {
				categories: labels,
				labels: { style: { fontFamily: 'inherit' } },
			},
			yaxis: { labels: { formatter: (v: number) => `$${v.toLocaleString()}`, style: { fontFamily: 'inherit' } } },
			stroke: { curve: 'smooth', width: 2 },
			markers: { size: 4 },
			dataLabels: { enabled: false },
			legend: { position: 'top', fontFamily: 'inherit' },
			grid: { borderColor: '#f3f4f6' },
			tooltip: { y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
			responsive: [
				{
					breakpoint: 768,
					options: {
						xaxis: {
							categories: labels,
							labels: {
								style: { fontFamily: 'inherit' },
								formatter: every5,
							},
						},
						markers: { size: 2 },
					},
				},
			],
		};
	}

	private buildDonutChart(): void {
		const expensesByBill: Record<string, number> = {};
		const billColors: Record<string, string> = {};
		this.transactions_income_expense.filter(t => t.type === 'expense').forEach(t => {
			const label = t.bill_name ?? 'Other';
			expensesByBill[label] = (expensesByBill[label] ?? 0) + (t.bill ?? 0);
			if (t.bill_color) billColors[label] = t.bill_color;
		});

		const labels = Object.keys(expensesByBill);
		const colors = labels.map(l => billColors[l] ?? '#64748b');
		this.donutChartSeries = Object.values(expensesByBill);

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

	private buildIncomeDonutChart(): void {
		const incomeByWallet: Record<string, number> = {};
		const walletColors: Record<string, string> = {};
		this.transactions_income_expense.filter(t => t.type === 'income').forEach(t => {
			const label = t.wallet_name ?? 'Other';
			incomeByWallet[label] = (incomeByWallet[label] ?? 0) + (t.wallet ?? 0);
			if (t.wallet_color) walletColors[label] = t.wallet_color;
		});

		const labels = Object.keys(incomeByWallet);
		const colors = labels.map(l => walletColors[l] ?? '#64748b');
		this.incomeDonutChartSeries = Object.values(incomeByWallet);

		this.incomeDonutChartOptions = {
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
