import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QrSetupFormControl } from "../login.contract";

export class TwoFaFormRequest {

	static build(fb: FormBuilder): FormGroup<QrSetupFormControl> {
		return fb.nonNullable.group({
			otp: [
				'',
				[
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(6),
					Validators.pattern(/^\d{6}$/),
				]
			]
		});
	}

}