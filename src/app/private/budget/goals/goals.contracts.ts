export interface Goal {
	id: number;
	name: string;
	amount: number;
	saved: number;
	deadline: string;
	description?: string;
	category_id?: number;
}

import { Category } from '../categories/categories.contracts';

export interface GoalDialogData {
	goal?: Goal;
	categories: Category[];
}
