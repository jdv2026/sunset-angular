import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryDialogData } from '../categories.contracts';

@Component({
	selector: 'vex-category-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './category-dialog.component.html',
	styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {

	form: FormGroup;
	isEdit: boolean;

	colors: string[] = [
		'#ef4444', '#f97316', '#f59e0b', '#eab308',
		'#84cc16', '#22c55e', '#10b981', '#14b8a6',
		'#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
		'#a855f7', '#ec4899', '#f43f5e', '#64748b',
	];

	icons: string[] = [
		'restaurant', 'directions_car', 'bolt', 'movie',
		'favorite', 'payments', 'shopping_cart', 'home',
		'flight', 'fitness_center', 'school', 'work',
		'sports_esports', 'local_hospital', 'pets', 'savings',
	];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<CategoryDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
	) {
		this.isEdit = !!data?.category;
		this.form = this.fb.group({
			name: [data?.category?.name ?? '', Validators.required],
			icon: [data?.category?.icon ?? 'payments', Validators.required],
			color: [data?.category?.color ?? '#3b82f6', Validators.required],
			budget: [data?.category?.budget ?? 0, [Validators.required, Validators.min(0)]],
		});
	}

	selectColor(color: string): void {
		this.form.patchValue({ color });
	}

	selectIcon(icon: string): void {
		this.form.patchValue({ icon });
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.dialogRef.close(this.form.value);
	}

	cancel(): void {
		this.dialogRef.close();
	}
}
