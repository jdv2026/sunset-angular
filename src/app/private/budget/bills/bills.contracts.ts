export type BillFrequency = 'weekly' | 'monthly' | 'yearly';
export type BillStatus = 'paid' | 'upcoming' | 'overdue';

export interface Bill {
	id: number;
	name: string;
	icon: string;
	color: string;
	amount: number;
	dueDate: string;
	frequency: BillFrequency;
	status: BillStatus;
	category: string;
}

export interface BillDialogData {
	bill: Bill;
}
