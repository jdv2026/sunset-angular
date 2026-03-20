import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VexChartComponent, ApexOptions } from '@vex/components/vex-chart/vex-chart.component';
import { Transaction } from '../transactions/transactions.contracts';
import { PrivateService } from '../../private.service';
import { OverviewService } from './overview.service';

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

	totalIncome = 0;
	totalExpenses = 0;
	unsignedMoney = 0;
	savingsRate = 0;

	weekIncome = 0;
	weekExpenses = 0;

	topTransactions: Transaction[] = [];
	topExpenses: Transaction[] = [];

	spendingChartOptions: ApexOptions = {};
	spendingChartSeries: ApexAxisChartSeries = [];

	constructor(
		private readonly privateService: PrivateService,
		private readonly overviewService: OverviewService,
	) {}

	private readonly now = new Date();

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Overview', crumbs: ['Budget', 'Overview'] });
		this.loadDashboard();
	}

	private async loadDashboard(): Promise<void> {
		try {
			const res = await this.overviewService.fetchActiveOverview();
			const p = res.payload;

			this.totalIncome = p.total_income ?? 0;
			this.totalExpenses = p.total_expense ?? 0;
			this.unsignedMoney = p.unassigned_money ?? 0;
			this.savingsRate = Math.round(p.savings_rate ?? 0);
			this.weekIncome = p.this_week_income ?? 0;
			this.weekExpenses = p.this_week_expense ?? 0;

				const transactions: Transaction[] = (p.transactions ?? []).map((item: any) => ({
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

			this.topTransactions = [...transactions]
				.sort((a, b) => ((b.wallet ?? 0) + (b.goal ?? 0) + (b.bill ?? 0)) - ((a.wallet ?? 0) + (a.goal ?? 0) + (a.bill ?? 0)))
				.slice(0, 5);

			this.topExpenses = [...transactions]
				.filter(t => t.type === 'expense')
				.sort((a, b) => (b.bill ?? 0) - (a.bill ?? 0))
				.slice(0, 5);

			const year = this.now.getFullYear();
			const month = this.now.getMonth();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const todayDay = this.now.getDate();
			const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

			const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
			const labels = days.map(d => String(d));
			const monthTx = transactions.filter(t => t.date.startsWith(monthPrefix));

			this.spendingChartSeries = [
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

			const every5 = (_val: string, index: number) => (index % 5 === 0 ? labels[index] : '');

			this.spendingChartOptions = {
				chart: { type: 'line', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
				colors: ['#22c55e', '#ef4444'],
				xaxis: { categories: labels, labels: { style: { fontFamily: 'inherit' } } },
				yaxis: { labels: { formatter: (v: number) => `$${v.toLocaleString()}`, style: { fontFamily: 'inherit' } } },
				stroke: { curve: 'smooth', width: 2 },
				markers: { size: 3 },
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
								labels: { style: { fontFamily: 'inherit' }, formatter: every5 },
							},
							markers: { size: 2 },
						},
					},
				],
			};
		} catch {
			// keep page empty on error
		}
	}
}
