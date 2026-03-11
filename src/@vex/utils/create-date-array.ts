import { DateTime } from 'luxon';

export function createDateArray(length: number) {
	const dates: number[] = [];

	for (let i = 0; i < length; i++) {
		dates.push(+DateTime.local().minus({ day: i }).toJSDate());
	}

	return dates.reverse();
}

export function createMonthArray(length: number, startMonth?: DateTime) {
	const months: number[] = [];
	const start = startMonth ?? DateTime.local(); 
  
	for (let i = 0; i < length; i++) {
		months.push(+start.minus({ months: length - i - 1 }).startOf('month').toJSDate());
	}
  
	return months;
}
