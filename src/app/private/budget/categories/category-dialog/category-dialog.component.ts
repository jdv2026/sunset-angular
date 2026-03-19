import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CategoryDialogData, CategoryType } from '../categories.contracts';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { CategoriesService } from '../categories.service';
import { LoggerService } from 'src/app/services/Logger.service';

@Component({
	selector: 'vex-category-dialog',
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
	templateUrl: './category-dialog.component.html',
	styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent implements OnInit {

	form: FormGroup;
	isEdit: boolean;
	colors: string[] = [];
	icons: string[] = [];
	readonly CategoryType = CategoryType;

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<CategoryDialogComponent>,
		private readonly categoriesService: CategoriesService,
		private readonly logService: LoggerService,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
	) {
		this.isEdit = !!data?.category;
		this.form = this.fb.group({
			name: [data?.category?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
			description: [data?.category?.description ?? '', [Validators.maxLength(500)]],
			icon: [data?.category?.icon ?? 'payments', [Validators.required, Validators.maxLength(20)]],
			color: [data?.category?.color ?? '#3b82f6', [Validators.required, Validators.maxLength(20)]],
			type: [data?.category?.type ?? CategoryType.Expense, [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.initIconCategories();
		this.initColorCategories();
	}

	selectColor(color: string): void {
		this.form.patchValue({ color });
	}

	selectIcon(icon: string): void {
		this.form.patchValue({ icon });
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.dialogRef.close(this.form.value);
	}

	cancel(): void {
		this.dialogRef.close();
	}

	private async initIconCategories(): Promise<void> {
		try {
			const res: ApiResponse = await this.categoriesService.fetchCategoriesIcon();
			this.icons = res.payload.map((item: { icon_name: string }) => item.icon_name);
		}
		catch (err: unknown) {
			this.logService.error('user', err);
		}
	}

	private async initColorCategories(): Promise<void> {
		try {
			const res: ApiResponse = await this.categoriesService.fetchCategoriesColor();
			this.colors = res.payload.map((item: { hex_code: string }) => item.hex_code);
		}
		catch (err: unknown) {
			this.logService.error('user', err);
		}
	}

}
