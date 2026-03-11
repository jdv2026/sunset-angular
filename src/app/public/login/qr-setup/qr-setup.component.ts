import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { LoginService } from '../login.service';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { QrSetupForm, QrSetupFormControl } from '../login.contract';
import { QrSetupFormRequest } from './qr-setup.formrequest';

@Component({
	selector: 'app-qr-setup',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
	],
	animations: [fadeInUp400ms],
	templateUrl: './qr-setup.component.html',
	styleUrl: './qr-setup.component.scss',
})
export class QrSetupComponent {

	@Input() qrCodeUrl!: string;
	@Input() secret!: string;
	@Output() setupComplete = new EventEmitter<ApiResponse>();
	@Output() cancelled = new EventEmitter<void>();

	qrSetupForm!: FormGroup<QrSetupFormControl>;
	loading = false;
	errorMessage = '';

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService,
	) {}

	ngOnInit(): void {
		this.qrSetupForm = QrSetupFormRequest.build(this.fb);
	}

	get qrSetupControls(): QrSetupFormControl {
		return this.qrSetupForm.controls;
	}

	onCancel(): void {
		this.cancelled.emit();
	}

	async onSubmit(): Promise<void> {
		if (this.qrSetupForm.invalid) {
			this.qrSetupForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		this.errorMessage = '';

		try {
			const payload: QrSetupForm = { ...this.qrSetupForm.getRawValue(), secret: this.secret };
			const res: ApiResponse = await this.loginService.verifyFirstTime2faCode(payload);
			this.setupComplete.emit(res);
		} 
		catch (err: unknown) {
			this.errorMessage = (err as any).error?.message ?? '2FA setup failed';
			this.qrSetupForm.reset({ otp: '' });
		} 
		finally {
			this.loading = false;
		}
	}

}
