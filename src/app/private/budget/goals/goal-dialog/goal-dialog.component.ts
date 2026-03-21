import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { GoalDialogData } from '../goals.contracts';
import { Category } from '../../categories/categories.contracts';

@Component({
	selector: 'vex-goal-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
	],
	templateUrl: './goal-dialog.component.html',
	styleUrl: './goal-dialog.component.scss',
})
export class GoalDialogComponent {

	readonly isEdit: boolean;
	readonly form: FormGroup;
	readonly categories: Category[];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<GoalDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) data: GoalDialogData | null,
	) {
		this.isEdit = !!data?.goal;
		this.categories = data?.categories ?? [];
		const g = data?.goal;
		this.form = this.fb.group({
			name: [g?.name ?? '', [Validators.required, Validators.maxLength(100)]],
			description: [g?.description ?? '', Validators.maxLength(255)],
			amount: [g?.saved ?? null, [Validators.required, Validators.min(0), Validators.max(999999.99)]],
			deadline: [g?.deadline ?? '', Validators.required],
			category_id: [g?.category_id ?? null, Validators.required],
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
