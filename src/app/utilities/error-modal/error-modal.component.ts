import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ErrorItem {
	header: string;
	message: string;
}
@Component({
	selector: 'app-error-modal',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	template: `
		<div class="error-header">
			<h2 mat-dialog-title>
			⚠ Error
			</h2>
		</div>
	
		<mat-dialog-content>
			<div *ngFor="let error of data.errors" class="error-item mb-4">
			<strong>{{ error.header }}</strong>
			<p>{{ error.message }}</p>
			</div>
		</mat-dialog-content>
	
		<mat-dialog-actions align="end">
			<button mat-button color="warn" (click)="close()">Close</button>
		</mat-dialog-actions>
	`,
	styles: [`
		.error-header {
			background-color: #f44336;
			padding: 10px 5px;
			border-radius: 4px 4px 0 0;
		}

		.error-header h2 {
			color: white;
			font-size: bold;
		}
	
		mat-dialog-content {
			max-height: 400px;
			overflow: auto;
			padding: 16px 24px;
		}
	
		.error-item strong {
			color: #b71c1c; /* Darker red for emphasis */
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

export class ErrorModalComponent {
	constructor(
		public dialogRef: MatDialogRef<ErrorModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { errors: ErrorItem[] }
	) {}

	close() {
		this.dialogRef.close();
	}
}
