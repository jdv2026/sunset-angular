import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Goal, GoalDialogData } from '../goals.contracts';

const ICON_OPTIONS = [
	'savings', 'flight', 'laptop', 'directions_car', 'home', 'school',
	'favorite', 'beach_access', 'shopping_bag', 'build', 'sports_esports', 'child_care',
	'local_hospital', 'attach_money', 'account_balance', 'card_giftcard',
];

const COLOR_OPTIONS = [
	'#22c55e', '#3b82f6', '#f97316', '#ec4899',
	'#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
	'#06b6d4', '#64748b', '#a855f7', '#14b8a6',
	'#f43f5e', '#84cc16', '#0ea5e9', '#d946ef',
];

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
	],
	templateUrl: './goal-dialog.component.html',
	styleUrl: './goal-dialog.component.scss',
})
export class GoalDialogComponent {

	readonly iconOptions = ICON_OPTIONS;
	readonly colorOptions = COLOR_OPTIONS;

	readonly isEdit: boolean;
	readonly form: FormGroup;

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<GoalDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) data: GoalDialogData | null,
	) {
		this.isEdit = !!data?.goal;
		const g = data?.goal;
		this.form = this.fb.group({
			name: [g?.name ?? '', Validators.required],
			target: [g?.target ?? null, [Validators.required, Validators.min(1)]],
			saved: [g?.saved ?? 0, [Validators.required, Validators.min(0)]],
			deadline: [g?.deadline ?? '', Validators.required],
			icon: [g?.icon ?? 'savings'],
			color: [g?.color ?? '#22c55e'],
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
