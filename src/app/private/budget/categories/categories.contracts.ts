export const CATEGORY_COLOR_MAP: Record<string, string> = {
	Food: '#f97316',
	Transport: '#3b82f6',
	Utilities: '#8b5cf6',
	Entertainment: '#ec4899',
	Health: '#10b981',
	Income: '#22c55e',
	Other: '#64748b',
};

export interface Category {
	id: number;
	name: string;
	icon: string;
	color: string;
	description: string;
}

export interface CategoryDialogData {
	category: Category;
}
