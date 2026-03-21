export interface Transaction {
	id: number;
	date: string;
	description: string;
	category: string;
	type: 'income' | 'expense' | 'transfer';
	wallet: number | null;
	wallet_name: string | null;
	wallet_color: string | null;
	goal: number | null;
	goal_name: string | null;
	goal_color: string | null;
	bill: number | null;
	bill_name: string | null;
	bill_color: string | null;
	status: 'completed' | 'pending' | 'failed';
}

export interface Month {
	value: string;
	label: string;
}

