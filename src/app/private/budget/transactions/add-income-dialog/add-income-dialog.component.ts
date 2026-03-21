import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoriesService } from '../../categories/categories.service';

@Component({
	selector: 'vex-add-income-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatTooltipModule,
	],
	templateUrl: './add-income-dialog.component.html',
	styleUrl: './add-income-dialog.component.scss',
})
export class AddIncomeDialogComponent implements OnInit {

	form: FormGroup;
	categories: { id: number; name: string; icon: string; color: string; description: string }[] = [];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<AddIncomeDialogComponent>,
		private readonly categoriesService: CategoriesService,
	) {
		this.form = this.fb.group({
			wallet_id: [null, Validators.required],
			amount: [null, [Validators.required, Validators.min(0.01)]],
		});
	}

	ngOnInit(): void {
		this.initCategories();
	}

	private async initCategories(): Promise<void> {
		try {
			const res = await this.categoriesService.fetchActiveCategoriesForWallets();
			this.categories = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				icon: item.category_icon,
				color: item.category_color,
				description: item.description || '',
			}));
		} catch {
			// silent
		}
	}

	get selectedCategory() {
		return this.categories.find(c => c.id === this.form.value.wallet_id);
	}

	compareCategory(a: any, b: any): boolean {
		return Number(a) === Number(b);
	}

	submit(): void {
		if (this.form.invalid) return;
		this.dialogRef.close(this.form.value);
	}

	cancel(): void {
		this.dialogRef.close();
	}

}
