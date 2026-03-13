import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Transaction } from '../transactions.contracts';

@Component({
	selector: 'vex-add-transaction-dialog',
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
		MatDatepickerModule,
		MatNativeDateModule,
	],
	templateUrl: './add-transaction-dialog.component.html',
	styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent {

	form: FormGroup;

	categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Income', 'Other'];
	statuses: Transaction['status'][] = ['completed', 'pending', 'failed'];

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<AddTransactionDialogComponent>
	) {
		this.form = this.fb.group({
			date: [new Date(), Validators.required],
			description: ['', Validators.required],
			category: ['', Validators.required],
			type: ['expense', Validators.required],
			amount: [null, [Validators.required, Validators.min(0.01)]],
			status: ['completed', Validators.required],
		});
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.value;
		const transaction: Omit<Transaction, 'id'> = {
			...value,
			date: value.date instanceof Date
				? value.date.toISOString().split('T')[0]
				: value.date,
		};

		this.dialogRef.close(transaction);
	}

	cancel(): void {
		this.dialogRef.close();
	}
}
