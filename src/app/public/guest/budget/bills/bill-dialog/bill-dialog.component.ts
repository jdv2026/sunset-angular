import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bill, BillDialogData } from '../bills.contracts';

const ICON_OPTIONS = [
	'home', 'bolt', 'wifi', 'phone', 'local_gas_station', 'water_drop',
	'tv', 'fitness_center', 'health_and_safety', 'school', 'directions_car', 'credit_card',
	'subscriptions', 'cloud', 'security', 'payments',
];

const COLOR_OPTIONS = [
	'#22c55e', '#3b82f6', '#f97316', '#ec4899',
	'#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
	'#06b6d4', '#64748b', '#a855f7', '#14b8a6',
	'#f43f5e', '#84cc16', '#0ea5e9', '#d946ef',
];

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

	readonly iconOptions = ICON_OPTIONS;
	readonly colorOptions = COLOR_OPTIONS;

	readonly isEdit: boolean;
	readonly form: FormGroup;

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<BillDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) data: BillDialogData | null,
	) {
		this.isEdit = !!data?.bill;
		const b = data?.bill;
		this.form = this.fb.group({
			name: [b?.name ?? '', Validators.required],
			amount: [b?.amount ?? null, [Validators.required, Validators.min(0.01)]],
			dueDate: [b?.dueDate ?? '', Validators.required],
			frequency: [b?.frequency ?? 'monthly', Validators.required],
			category: [b?.category ?? '', Validators.required],
			status: [b?.status ?? 'upcoming', Validators.required],
			icon: [b?.icon ?? 'credit_card'],
			color: [b?.color ?? '#3b82f6'],
		});
	}

	selectIcon(icon: string): void {
		this.form.patchValue({ icon });
	}

	selectColor(color: string): void {
		this.form.patchValue({ color });
	}

	submit(): void {
		if (this.form.invalid) return;
		this.dialogRef.close(this.form.value);
	}

	cancel(): void {
		this.dialogRef.close();
	}
}
