export interface Goal {
	id: number;
	name: string;
	icon: string;
	color: string;
	target: number;
	saved: number;
	deadline: string;
}

export interface GoalDialogData {
	goal: Goal;
}
