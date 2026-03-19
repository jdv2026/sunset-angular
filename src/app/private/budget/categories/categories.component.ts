import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { Category, CategoryDialogData } from './categories.contracts';
import { PrivateService } from '../../private.service';
import { CategoriesService } from './categories.service';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SuccessModalComponent } from 'src/app/utilities/success-modal/success-modal.component';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { ErrorHandlerService } from 'src/app/services/ErrorHandler.service';

@Component({
	selector: 'vex-categories',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
		MatTooltipModule,
	],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

	categories: Category[] = [];
	expandedMap: { [id: number]: boolean } = {};

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
		private readonly categoriesService: CategoriesService,
		private readonly errorHandler: ErrorHandlerService,
	) {}

	ngOnInit(): void {
		this.setBreadcrumb();
		this.initActiveCategories();
	}

	toggleDescription(index: number): void {
		this.expandedMap = { ...this.expandedMap, [index]: !this.expandedMap[index] };
	}

	openAdd(): void {
		const ref = this.dialog.open(CategoryDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true });
		ref.afterClosed().subscribe(async (result: Omit<Category, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.categoriesService.storeCategoriesIcon({ payload: result } as any);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Category Created', message: `"${result.name}" has been added successfully.` }] },
					width: '400px',
				});
				this.initActiveCategories();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Create', err);
			}
		});
	}

	openEdit(category: Category): void {
		const data: CategoryDialogData = { category };
		const ref = this.dialog.open(CategoryDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true, data });
		ref.afterClosed().subscribe(async (result: Omit<Category, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.categoriesService.updateActiveCategory(category.id, result);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Category Updated', message: `"${result.name}" has been updated successfully.` }] },
					width: '400px',
				});
				this.initActiveCategories();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Update', err);
			}
		});
	}

	delete(category: Category): void {
		const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '400px',
			data: {
				warning: true,
				items: [{
					header: 'Delete Category',
					message: `Are you sure you want to delete "${category.name}"?`,
					description: 'This will permanently delete all data related to this category, including its transactions and history.',
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
				await this.categoriesService.deleteActiveCategory(category.id);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Category Deleted', message: `"${category.name}" has been deleted successfully.` }] },
					width: '400px',
				});
				this.categories = this.categories.filter(c => c.id !== category.id);
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Delete', err);
			}
		});
	}

	private setBreadcrumb(): void {
		this.privateService.setCrumbs({
			current: 'Categories',
			crumbs: ['Budget', 'Categories'],
		});
	}

	private async initActiveCategories(): Promise<void> {
		try {
			const res: ApiResponse = await this.categoriesService.fetchActiveCategories();
			this.categories = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				icon: item.icon,
				color: item.color,
				type: item.type,
			}));

		}
		catch (err: unknown) {
			this.errorHandler.open('Failed to Load', err);
		}
	}
	
}
