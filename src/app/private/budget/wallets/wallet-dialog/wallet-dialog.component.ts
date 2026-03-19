import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WalletDialogData } from '../wallets.contracts';
import { Category } from '../../categories/categories.contracts';

@Component({
	selector: 'vex-wallet-dialog',
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
	templateUrl: './wallet-dialog.component.html',
	styleUrl: './wallet-dialog.component.scss',
})
export class WalletDialogComponent {

	readonly isEdit: boolean;
	readonly form: FormGroup;
	readonly categories: Category[];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<WalletDialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) data: WalletDialogData | null,
	) {
		this.isEdit = !!data?.wallet;
		this.categories = data?.categories ?? [];
		const w = data?.wallet;
		this.form = this.fb.group({
			name: [w?.name ?? '', [Validators.required, Validators.maxLength(100)]],
			description: [w?.description ?? '', Validators.maxLength(255)],
category_id: [w?.category_id ?? null, Validators.required],
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
