import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface SuccessItem {
	header: string;
	message: string;
}

@Component({
	selector: 'app-success-modal',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	template: `
		<div class="success-header">
		<h2 mat-dialog-title>

		</h2>
		</div>

		<mat-dialog-content>
		<div *ngFor="let item of data.items" class="success-item mb-4">
			<strong>{{ item.header }}</strong>
			<p>{{ item.message }}</p>
		</div>
		</mat-dialog-content>

		<mat-dialog-actions align="end">
		<button mat-button color="primary" (click)="close()">Close</button>
		</mat-dialog-actions>
	`,
	styles: [`
		.success-header {
		background-color: #4caf50; /* Green */
		padding: 10px 5px;
		border-radius: 4px 4px 0 0;
		}

		.success-header h2 {
		color: white;
		font-weight: bold;
		}

		mat-dialog-content {
		max-height: 400px;
		overflow: auto;
		padding: 16px 24px;
		}

		.success-item strong {
		color: #1b5e20; /* Darker green for emphasis */
		}

		p {
		margin: 4px 0 0 0;
		}

		mat-dialog-actions {
		padding: 8px 24px;
		}

		button[mat-button] {
		min-width: 80px;
		}
	`]
})
export class SuccessModalComponent {
	constructor(
		public dialogRef: MatDialogRef<SuccessModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { items: SuccessItem[] }
	) {}

	close() {
		this.dialogRef.close();
	}
}
