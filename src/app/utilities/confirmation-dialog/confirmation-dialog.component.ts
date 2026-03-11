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

		<mat-dialog-actions align="end" class="actions-row">
			<button mat-button color="primary" (click)="ok()">Ok</button>
			<button mat-button color="primary" (click)="close()">Close</button>
		</mat-dialog-actions>
	`,
	styles: [`
		.success-header {
			background-color:rgb(76, 91, 175); /* Green */
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
			color:rgb(27, 37, 94); /* Darker green for emphasis */
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
export class ConfirmationDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { items: SuccessItem[] }
	) {}

	close() {
		this.dialogRef.close(false);
	}

	ok() {
		this.dialogRef.close(true);
	}
}
