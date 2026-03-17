import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BillDialogData } from '../bills.contracts';
import { Category } from '../../categories/categories.contracts';

@Component({
	selector: 'vex-bill-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './bill-dialog.component.html',
	styleUrl: './bill-dialog.component.scss',
})
export class BillDialogComponent {

	readonly isEdit: boolean;
	readonly form: FormGroup;
	readonly categories: Category[];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<BillDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) data: BillDialogData | null,
	) {
		this.isEdit = !!data?.bill;
		this.categories = data?.categories ?? [];
		const b = data?.bill;
		this.form = this.fb.group({
			name: [b?.name ?? '', Validators.required],
			description: [b?.description ?? ''],
			amount: [b?.amount ?? null, [Validators.required, Validators.min(0.01)]],
			due_date: [b?.due_date ?? '', Validators.required],
			frequency: [b?.frequency ?? 'monthly', Validators.required],
			category_id: [b?.category_id ?? null],
		});
	}

	get selectedCategory(): Category | undefined {
		return this.categories.find(c => c.id === this.form.value.category_id);
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
