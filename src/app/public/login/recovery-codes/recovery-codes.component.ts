import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { ApiResponse } from 'src/app/contracts/ApiResponse';
import { authCredentials } from '../login.contract';

@Component({
	selector: 'app-recovery-codes',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
	],
	animations: [fadeInUp400ms],
	templateUrl: './recovery-codes.component.html',
	styleUrl: './recovery-codes.component.scss',
})
export class RecoveryCodesComponent {

	@Input() res!: ApiResponse<authCredentials>;
	@Output() acknowledged = new EventEmitter<ApiResponse<authCredentials>>();

	copied = false;

	get codes(): string[] {
		return this.res?.payload?.recovery_codes ?? [];
	}

	async onCopy(): Promise<void> {
		await navigator.clipboard.writeText(this.codes.join('\n'));
		this.copied = true;
		setTimeout(() => this.copied = false, 2000);
	}

	onContinue(): void {
		this.acknowledged.emit(this.res);
	}
}
