import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WalletDialogComponent } from './wallet-dialog/wallet-dialog.component';
import { Wallet, WalletDialogData } from './wallets.contracts';
import { PrivateService } from '../../private.service';
import { WalletsService } from './wallets.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/categories.contracts';
import { LoadingComponent } from 'src/app/utilities/loading/loading.component';
import { SuccessModalComponent } from 'src/app/utilities/success-modal/success-modal.component';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { ErrorHandlerService } from 'src/app/services/ErrorHandler.service';

@Component({
	selector: 'vex-wallets',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatMenuModule,
		MatTooltipModule,
		ConfirmationDialogComponent,
	],
	templateUrl: './wallets.component.html',
	styleUrl: './wallets.component.scss',
})
export class WalletsComponent implements OnInit {

	wallets: Wallet[] = [];
	categories: Category[] = [];

	constructor(
		private readonly dialog: MatDialog,
		private readonly privateService: PrivateService,
		private readonly walletsService: WalletsService,
		private readonly categoriesService: CategoriesService,
		private readonly errorHandler: ErrorHandlerService,
	) {}

	ngOnInit(): void {
		this.privateService.setCrumbs({ current: 'Wallets', crumbs: ['Budget', 'Wallets'] });
		this.initCategories();
		this.initActiveWallets();
	}

	get totalBalance(): number {
		return this.wallets.reduce((s, w) => s + w.balance, 0);
	}

	get highestBalanceWallet(): Wallet | undefined {
		if (!this.wallets.length) return undefined;
		return this.wallets.reduce((max, w) => w.balance > max.balance ? w : max, this.wallets[0]);
	}

	get lowBalanceCount(): number {
		return this.wallets.filter(w => w.balance < 100).length;
	}

	getCategoryFor(wallet: Wallet): Category | undefined {
		return this.categories.find(c => c.id === wallet.category_id);
	}

	openAdd(): void {
		const data: WalletDialogData = { categories: this.categories };
		const ref = this.dialog.open(WalletDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true, data });
		ref.afterClosed().subscribe(async (result: Omit<Wallet, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.walletsService.storeWallet({ payload: result } as any);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Wallet Created', message: `"${result.name}" has been added successfully.` }] },
					width: '400px',
				});
				this.initActiveWallets();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Create', err);
			}
		});
	}

	openEdit(wallet: Wallet): void {
		const data: WalletDialogData = { wallet, categories: this.categories };
		const ref = this.dialog.open(WalletDialogComponent, { width: '90vw', maxWidth: '480px', disableClose: true, data });
		ref.afterClosed().subscribe(async (result: Omit<Wallet, 'id'> | undefined) => {
			if (!result) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Saving', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.walletsService.updateWallet(wallet.id, result);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Wallet Updated', message: `"${result.name}" has been updated successfully.` }] },
					width: '400px',
				});
				this.initActiveWallets();
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Update', err);
			}
		});
	}

	delete(wallet: Wallet): void {
		const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '400px',
			data: {
				warning: true,
				items: [{
					header: 'Delete Wallet',
					message: `Are you sure you want to delete "${wallet.name}"?`,
					description: 'This will permanently delete this wallet and all its data.',
				}],
			},
		});
		confirmRef.afterClosed().subscribe(async (confirmed: boolean) => {
			if (!confirmed) return;
			const loadingRef = this.dialog.open(LoadingComponent, {
				disableClose: true,
				panelClass: 'loading-dialog',
				backdropClass: 'loading-backdrop',
				data: { title: 'Deleting', message: 'Please wait...' },
				width: '400px',
			});
			try {
				await this.walletsService.deleteWallet(wallet.id);
				loadingRef.close();
				this.dialog.open(SuccessModalComponent, {
					data: { items: [{ header: 'Wallet Deleted', message: `"${wallet.name}" has been deleted successfully.` }] },
					width: '400px',
				});
				this.wallets = this.wallets.filter(w => w.id !== wallet.id);
			} catch (err: unknown) {
				loadingRef.close();
				this.errorHandler.open('Failed to Delete', err);
			}
		});
	}

	private async initActiveWallets(): Promise<void> {
		try {
			const res = await this.walletsService.fetchActiveWallets();
			this.wallets = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				balance: item.balance,
				category_id: item.category_id,
			}));
		} catch (err: unknown) {
			this.errorHandler.open('Failed to Load', err);
		}
	}

	private async initCategories(): Promise<void> {
		try {
			const res = await this.categoriesService.fetchActiveCategoriesForWallets();
			this.categories = res.payload.map((item: any) => ({
				id: item.id,
				name: item.name,
				icon: item.icon,
				color: item.color,
				description: item.description,
			}));
		} catch {

		}
	}

}
