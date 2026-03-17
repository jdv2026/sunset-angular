import { Category } from '../categories/categories.contracts';

export type BillFrequency = 'weekly' | 'monthly' | 'yearly';
export type BillStatus = 'paid' | 'upcoming' | 'overdue';

export interface Bill {
	id: number;
	name: string;
	amount: number;
	due_date: string;
	frequency: BillFrequency;
	status: BillStatus;
	description?: string;
	category_id?: number;
}

export interface BillDialogData {
	bill?: Bill;
	categories: Category[];
}
