import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from 'src/app/contracts/ApiError';
import { ErrorModalComponent } from 'src/app/utilities/error-modal/error-modal.component';

@Injectable({
	providedIn: 'root',
})
export class ErrorHandlerService {

	constructor(private readonly dialog: MatDialog) {}

	open(header: string, err: unknown): void {
		const apiError = err instanceof HttpErrorResponse ? (err.error as ApiError) : null;
		const validationErrors = apiError?.errors as unknown as Record<string, string[]> | undefined;

		const errors = validationErrors && Object.keys(validationErrors).length
			? Object.entries(validationErrors).map(([, messages]) => ({
				header,
				message: messages[0],
			}))
			: [{ header, message: apiError?.message ?? 'An unexpected error occurred. Please try again.' }];

		this.dialog.open(ErrorModalComponent, {
			data: { errors },
			width: '400px',
		});
	}
}
