import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { Category, CategoryDialogData } from './categories.contracts';
import { PrivateService } from 'src/app/private/private.service';

@Component({
	selector: 'vex-categories',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
	],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

	categories: Category[] = [
		{ id: 1, name: 'Food', icon: 'restaurant', color: '#f97316', budget: 500, spent: 147.90 },
		{ id: 2, name: 'Transport', icon: 'directions_car', color: '#3b82f6', budget: 200, spent: 45.00 },
		{ id: 3, name: 'Utilities', icon: 'bolt', color: '#8b5cf6', budget: 300, spent: 120.00 },
		{ id: 4, name: 'Entertainment', icon: 'movie', color: '#ec4899', budget: 150, spent: 15.99 },
		{ id: 5, name: 'Health', icon: 'favorite', color: '#10b981', budget: 250, spent: 0 },
		{ id: 6, name: 'Income', icon: 'payments', color: '#22c55e', budget: 0, spent: 0 },
	];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
	) {}

	ngOnInit(): void {
		this.setBreadcrumb();
	}

	getProgress(category: Category): number {
		if (category.budget === 0) return 0;
		return Math.min((category.spent / category.budget) * 100, 100);
	}

	getProgressColor(category: Category): string {
		const pct = this.getProgress(category);
		if (pct >= 90) return '#ef4444';
		if (pct >= 70) return '#f59e0b';
		return category.color;
	}

	openAdd(): void {
		const ref = this.dialog.open(CategoryDialogComponent, { width: '480px' });
		ref.afterClosed().subscribe((result: Omit<Category, 'id' | 'spent'> | undefined) => {
			if (!result) return;
			this.categories.push({ ...result, id: this.categories.length + 1, spent: 0 });
		});
	}

	openEdit(category: Category): void {
		const data: CategoryDialogData = { category };
		const ref = this.dialog.open(CategoryDialogComponent, { width: '480px', data });
		ref.afterClosed().subscribe((result: Omit<Category, 'id' | 'spent'> | undefined) => {
			if (!result) return;
			const idx = this.categories.findIndex(c => c.id === category.id);
			if (idx !== -1) this.categories[idx] = { ...this.categories[idx], ...result };
		});
	}

	delete(id: number): void {
		this.categories = this.categories.filter(c => c.id !== id);
	}

	private setBreadcrumb(): void {
		this.privateService.setCrumbs({
			current: 'Categories',
			crumbs: ['Budget', 'Categories'],
		});
	}
	
}
