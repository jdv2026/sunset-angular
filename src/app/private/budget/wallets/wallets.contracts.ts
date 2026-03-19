import { Category } from '../categories/categories.contracts';

export interface Wallet {
    id: number;
    name: string;
    balance: number;
    description?: string;
    category_id?: number;
}

export interface WalletDialogData {
    wallet?: Wallet;
    categories: Category[];
}
