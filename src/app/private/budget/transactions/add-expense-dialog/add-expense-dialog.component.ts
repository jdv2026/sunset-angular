import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { TransactionsService } from '../transactions.service';

export interface TransferOption {
	key: string;
	name: string;
	type: 'wallet' | 'goal' | 'bill';
	icon: string;
	id: number;
	description: string;
	balance: number;      // wallets: current balance
	saved: number;        // goals: amount already saved
	paid: number;         // bills: amount already paid
	targetAmount: number; // goals: goal target; bills: total bill amount
}

const TYPE_ICON: Record<TransferOption['type'], string> = {
	wallet: 'account_balance_wallet',
	goal: 'savings',
	bill: 'receipt_long',
};

@Component({
	selector: 'vex-add-expense-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatIconModule,
		MatTooltipModule,
	],
	templateUrl: './add-expense-dialog.component.html',
	styleUrl: './add-expense-dialog.component.scss',
})
export class AddExpenseDialogComponent implements OnInit, OnDestroy {

	form: FormGroup;
	walletOptions: TransferOption[] = [];
	goalOptions: TransferOption[] = [];
	billOptions: TransferOption[] = [];

	private subs = new Subscription();

	constructor(
		private readonly fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<AddExpenseDialogComponent>,
		private readonly transactionsService: TransactionsService,
) {
		this.form = this.fb.group({
			from: [null, Validators.required],
			to: [null, Validators.required],
			amount: [null, [Validators.required, Validators.min(0.01)]],
		});
	}

	ngOnInit(): void {
		this.initOptions();
		this.subs.add(
			this.form.get('from')!.valueChanges.subscribe(() => {
				this.form.get('to')!.setValue(null);
				this.updateAmountValidators();
			})
		);
		this.subs.add(
			this.form.get('to')!.valueChanges.subscribe(() => {
				this.updateAmountValidators();
			})
		);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}

	get allOptions(): TransferOption[] {
		return [...this.walletOptions, ...this.goalOptions, ...this.billOptions];
	}

	get fromOpt(): TransferOption | undefined {
		return this.getSelected('from');
	}

	get toOpt(): TransferOption | undefined {
		return this.getSelected('to');
	}

	/** Overall max allowed for the current from→to combination */
	get maxTransferAmount(): number {
		const from = this.fromOpt;
		const to = this.toOpt;
		if (!from) return Infinity;
		const outMax = this.maxTransferOut(from);
		if (!to) return outMax;
		return Math.min(outMax, this.maxReceive(to));
	}

	// To options filtered by from: goals/bills can only transfer to wallets
	get toWalletOptions(): TransferOption[] { return this.walletOptions; }

	get toGoalOptions(): TransferOption[] {
		return this.fromOpt && this.fromOpt.type !== 'wallet' ? [] : this.goalOptions;
	}

	get toBillOptions(): TransferOption[] {
		return this.fromOpt && this.fromOpt.type !== 'wallet' ? [] : this.billOptions;
	}

	/** Max amount that can be sent FROM an option */
	maxTransferOut(opt: TransferOption): number {
		if (opt.type === 'wallet') return opt.balance;
		if (opt.type === 'goal') return opt.saved;
		if (opt.type === 'bill') return opt.paid;
		return 0;
	}

	/** Max amount a TO option can receive (Infinity = unlimited) */
	maxReceive(opt: TransferOption): number {
		if (opt.type === 'wallet') return Infinity;
		if (opt.type === 'goal') return Math.max(0, opt.targetAmount - opt.saved);
		if (opt.type === 'bill') return Math.max(0, opt.targetAmount - opt.paid);
		return Infinity;
	}

	fromTooltipFor(opt: TransferOption): string {
		console.log(opt)
		const parts: string[] = [];
		if (opt.description) parts.push(opt.description);
		const out = this.maxTransferOut(opt);
		const label = opt.type === 'wallet' ? 'Balance' : 'Available to transfer';
		parts.push(`${label}: $${out.toFixed(2)}`);
		return parts.join('\n');
	}

	toTooltipFor(opt: TransferOption): string {
		const parts: string[] = [];
		if (opt.description) parts.push(opt.description);
		const receive = this.maxReceive(opt);
		if (isFinite(receive)) {
			const label = opt.type === 'goal' ? 'Remaining capacity' : 'Remaining to pay';
			parts.push(`${label}: $${receive.toFixed(2)}`);
		} else {
			parts.push('No receiving limit');
		}
		return parts.join('\n');
	}

	getSelected(controlName: string): TransferOption | undefined {
		return this.allOptions.find(o => o.key === this.form.get(controlName)?.value);
	}

	submitTransfer(): void {
		if (this.form.invalid) return;
		this.dialogRef.close({ ...this.form.value, action: 'transfer' });
	}

	submitPay(): void {
		if (this.form.invalid) return;
		this.dialogRef.close({ ...this.form.value, action: 'pay' });
	}

	isFinite(n: number): boolean {
		return isFinite(n);
	}

	cancel(): void {
		this.dialogRef.close();
	}

	private async initOptions(): Promise<void> {
		try {
			const res = await this.transactionsService.fetchTransferPayOptions();
			const data = res.payload;
			if (data.wallets) {
				this.walletOptions = data.wallets.map((w: any) => ({
					key: `wallet:${w.id}`,
					name: w.name,
					type: 'wallet' as const,
					icon: TYPE_ICON['wallet'],
					id: w.id,
					description: w.description || '',
					balance: w.amount ?? 0,
					saved: 0,
					paid: 0,
					targetAmount: 0,
				}));
			}
			if (data.goals) {
				this.goalOptions = data.goals.map((g: any) => ({
					key: `goal:${g.id}`,
					name: g.name,
					type: 'goal' as const,
					icon: TYPE_ICON['goal'],
					id: g.id,
					description: g.description || '',
					balance: 0,
					saved: g.saved ?? 0,
					paid: 0,
					targetAmount: g.amount ?? 0,
				}));
			}
			if (data.bills) {
				this.billOptions = data.bills.map((b: any) => ({
					key: `bill:${b.id}`,
					name: b.name,
					type: 'bill' as const,
					icon: TYPE_ICON['bill'],
					id: b.id,
					description: b.description || '',
					balance: 0,
					saved: 0,
					paid: b.paid ?? 0,
					targetAmount: b.amount ?? 0,
				}));
			}
		} catch {
			// silent
		}
	}

	private updateAmountValidators(): void {
		const max = this.maxTransferAmount;
		const amountCtrl = this.form.get('amount')!;
		const validators = [Validators.required, Validators.min(0.01)];
		if (isFinite(max)) {
			validators.push(Validators.max(max));
		}
		amountCtrl.setValidators(validators);
		amountCtrl.updateValueAndValidity();
	}

}
