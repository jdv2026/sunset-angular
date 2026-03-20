import { Category } from '../categories/categories.contracts';

export interface Wallet {
    id: number;
    name: string;
    balance: number;
    description?: string;
    category_name?: string;
    category_icon?: string;
    category_color?: string;
}

export interface WalletDialogData {
    wallet?: Wallet;
    categories: Category[];
}
