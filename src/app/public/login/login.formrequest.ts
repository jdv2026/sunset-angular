import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LogingFormControl } from "./login.contract";


export class LoginFormRequest {

	static build(fb: FormBuilder): FormGroup<LogingFormControl> {
		return fb.nonNullable.group({
				username: [
					'', 
					[
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(50)
					]
				],
				password: ['', [
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(50)
			]]
		});
	}
	
}