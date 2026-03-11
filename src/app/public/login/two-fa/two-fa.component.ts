import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { LoginService } from '../login.service';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { TwoFaFormRequest } from './two-fa.formrequest';
import { QrSetupForm, QrSetupFormControl, RecoveryForm, RecoveryFormControl } from '../login.contract';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-two-fa',
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
	templateUrl: './two-fa.component.html',
	styleUrl: './two-fa.component.scss',
})
export class TwoFaComponent {

	@Output() verified = new EventEmitter<ApiResponse>();
	@Output() recovered = new EventEmitter<void>();
	@Output() cancelled = new EventEmitter<void>();

	twoFaForm!: FormGroup<QrSetupFormControl>;
	recoveryForm!: FormGroup<RecoveryFormControl>;
	isRecoveryMode = false;
	loading = false;
	errorMessage = '';

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService,
	) {}

	ngOnInit(): void {
		this.twoFaForm = TwoFaFormRequest.build(this.fb);
		this.recoveryForm = this.fb.nonNullable.group<RecoveryFormControl>({
			recovery_code: this.fb.nonNullable.control('', [Validators.required])
		});
	}

	get twoFaControls(): QrSetupFormControl {
		return this.twoFaForm.controls;
	}

	get recoveryControls(): RecoveryFormControl {
		return this.recoveryForm.controls;
	}

	toggleRecoveryMode(): void {
		this.isRecoveryMode = !this.isRecoveryMode;
		this.errorMessage = '';
		this.twoFaForm.reset({ otp: '' });
		this.recoveryForm.reset({ recovery_code: '' });
	}

	async onSubmit(): Promise<void> {
		if (this.twoFaForm.invalid) {
			this.twoFaForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		this.errorMessage = '';

		try {
			const payload: QrSetupForm = this.twoFaForm.getRawValue();
			const res: ApiResponse = await this.loginService.verify2faCode(payload);
			this.verified.emit(res);
		}
		catch (err: unknown) {
			this.errorMessage = (err as any).error?.message ?? '2FA verification failed';
			this.twoFaForm.reset({ otp: '' });
		}
		finally {
			this.loading = false;
		}
	}

	async onRecoverySubmit(): Promise<void> {
		if (this.recoveryForm.invalid) {
			this.recoveryForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		this.errorMessage = '';

		try {
			const payload: RecoveryForm = this.recoveryForm.getRawValue();
			await this.loginService.recoverLogin(payload);
			this.recovered.emit();
		}
		catch (err: unknown) {
			this.errorMessage = (err as any).error?.message ?? 'Recovery failed';
			this.recoveryForm.reset({ recovery_code: '' });
		}
		finally {
			this.loading = false;
		}
	}

	onCancel(): void {
		this.cancelled.emit();
	}
}