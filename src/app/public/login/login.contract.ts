import { FormControl } from "@angular/forms";

export type LogingFormControl = {
	username: FormControl<string>;
	password: FormControl<string>;
}

export type LoginForm = {
	username: string;
	password: string;
};

export type preLoginResponse = {
	is_2fa_enabled: boolean;
	token: string,
	qr_code_url: qr_code_url | null,
};

export type qr_code_url = {
	qr_code: string;
	secret: string;
};

export type QrSetupFormControl = {
	otp: FormControl<string>;
};

export type QrSetupForm = {
	otp: string;
	secret?: string;
};

export type RecoveryFormControl = {
	recovery_code: FormControl<string>;
};

export type RecoveryForm = {
	recovery_code: string;
};

export type authCredentials = {
	token: string;
	user: User;
	recovery_codes: string[];
};

export type User = {
	id: number;
	first_name: string | null;
	last_name: string | null;
	username: string;
	type: string;
	created_at: string;
	updated_at: string;
};
