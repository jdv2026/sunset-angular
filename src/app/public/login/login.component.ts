import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { preLoginResponse, LoginForm, LogingFormControl, authCredentials,  } from './login.contract';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { StorageService } from 'src/app/services/Storage.service';
import { AppService } from 'src/app/app.service';
import { MainLoadingComponent } from 'src/app/utilities/main-loading/main-loading.component';
import { LoginFormRequest } from './login.formrequest';
import { TwoFaComponent } from './two-fa/two-fa.component';
import { QrSetupComponent } from './qr-setup/qr-setup.component';
import { RecoveryCodesComponent } from './recovery-codes/recovery-codes.component';

@Component({
	selector: 'vex-login',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		CommonModule,
		ReactiveFormsModule,
		MainLoadingComponent,
		TwoFaComponent,
		QrSetupComponent,
		RecoveryCodesComponent,
	],
	animations: [
		fadeInUp400ms
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	providers: [LoginService]
})

export class LoginComponent {

	loginForm!: FormGroup<LogingFormControl>;
	loading = false;
	errorMessage = '';
	recoverySuccessMessage = '';
	show2fa = false;
	showQrSetup = false;
	showRecoveryCodes = false;
	qrCodeUrl = '';
	qrSecret = '';
	recoveryCodesRes: ApiResponse<authCredentials> | null = null;

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService,
		private storageService: StorageService,
		private appService: AppService,
		private router: Router,
	) {}

	ngOnInit() {
		this.loginForm = LoginFormRequest.build(this.fb);
	}

	get loginControls(): LogingFormControl {
		return this.loginForm.controls;
	}

	onSubmit(): void {
		this.initializeLoginAttempt();

		if (this.isFormInvalid()) {
			this.loginForm.markAllAsTouched();
			return;
		}

		this.loginAttempt();
	}

	on2faVerified(res: ApiResponse): void {
		this.onLoginSuccess(res);
	}

	on2faCancelled(): void {
		this.show2fa = false;
		this.storageService.clearToken();
	}

	on2faRecovered(): void {
		this.show2fa = false;
		this.storageService.clearToken();
		this.recoverySuccessMessage = '2FA has been reset. Please sign in again to set up your new authenticator.';
	}

	onQrSetupComplete(res: ApiResponse<authCredentials>): void {
		this.showQrSetup = false;
		this.recoveryCodesRes = res;
		this.showRecoveryCodes = true;
	}

	onRecoveryCodesAcknowledged(res: ApiResponse<authCredentials>): void {
		this.showRecoveryCodes = false;
		this.recoveryCodesRes = null;
		this.onLoginSuccess(res);
	}

	onQrSetupCancelled(): void {
		this.showQrSetup = false;
		this.qrCodeUrl = '';
		this.qrSecret = '';
		this.storageService.clearToken();
	}

	private isFormInvalid(): boolean {
		return this.loginForm.invalid;
	}
	
	private initializeLoginAttempt(): void {
		this.storageService.clearToken();
		this.errorMessage = '';
		this.recoverySuccessMessage = '';
		this.loading = true;
	}

	private async loginAttempt(): Promise<void> {
		try {
			const requestPayload: LoginForm = this.loginForm.getRawValue();
			const res: ApiResponse<preLoginResponse> = await this.loginService.adminLogin(requestPayload);
			this.loginForm.reset({ username: '', password: '' });
			this.loading = false;
			this.initiate2faLogin(res);
		}
		catch (err: unknown) {
			this.onFailedLogin(err);
		}
	}

	private async initiate2faLogin(res: ApiResponse<preLoginResponse>): Promise<void> {
		if (this.isFirstTimeLogin(res)) {
			this.storageService.setToken(res.payload.token);
			this.qrCodeUrl = res.payload.qr_code_url?.qr_code ?? '';
			this.qrSecret = res.payload.qr_code_url?.secret ?? '';
			this.showQrSetup = true;
		} 
		else {
			this.storageService.setToken(res.payload.token);
			this.show2fa = true;
		}
	}

	private isFirstTimeLogin(res: ApiResponse): boolean {
		return !res.payload.is_2fa_enabled;
	}

	private onLoginSuccess(res: ApiResponse<authCredentials>): void {
		this.storageService.setToken(res.payload.token);
		this.appService.setUser(res.payload.user);
		this.router.navigate(['/dashboard/home']);
	}

	private onFailedLogin(err: unknown): void {
		this.errorMessage = (err as any).error.message ?? 'Login failed';
		this.loading = false;
		this.loginForm.reset({
			username: '',
			password: ''
		});
	}

}
