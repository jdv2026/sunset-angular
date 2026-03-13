export interface Transaction {
	id: number;
	date: string;
	description: string;
	category: string;
	type: 'income' | 'expense';
	amount: number;
	status: 'completed' | 'pending' | 'failed';
}

export interface Month {
	value: string;
	label: string;
}
