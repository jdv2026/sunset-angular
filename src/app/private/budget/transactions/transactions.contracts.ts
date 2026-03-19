export interface Transaction {
	id: number;
	date: string;
	description: string;
	category: string;
	type: 'income' | 'expense' | 'transfer';
	wallet: number | null;
	goal: number | null;
	bill: number | null;
	status: 'completed' | 'pending' | 'failed';
}

export interface Month {
	value: string;
	label: string;
}

