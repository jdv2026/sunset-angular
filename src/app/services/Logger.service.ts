import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from '../contracts/LogLevel';

@Injectable({
  	providedIn: 'root',
})
export class LoggerService {

	private readonly level: LogLevel;

	constructor() {
		this.level = environment.isProduction
			? LogLevel.ERROR
			: LogLevel.DEBUG;
	}

	debug(message: string, data?: unknown): void {
		this.log(LogLevel.DEBUG, message, data);
	}

	info(message: string, data?: unknown): void {
		this.log(LogLevel.INFO, message, data);
	}

	warn(message: string, data?: unknown): void {
		this.log(LogLevel.WARN, message, data);
	}

	error(message: string, data?: unknown): void {
		this.log(LogLevel.ERROR, message, data);
	}

	/* -------------------------
	* Core logger
	* ------------------------- */

	private log(level: LogLevel, message: string, data?: unknown): void {
		if (level < this.level) {
		return;
		}

		const timestamp = new Date().toISOString();
		const prefix = `[${LogLevel[level]}] ${timestamp}`;

		switch (level) {
		case LogLevel.DEBUG:
			console.debug(prefix, message, data ?? '');
			break;

		case LogLevel.INFO:
			console.info(prefix, message, data ?? '');
			break;

		case LogLevel.WARN:
			console.warn(prefix, message, data ?? '');
			break;

		case LogLevel.ERROR:
			console.error(prefix, message, data ?? '');
			break;
		}
	}
}
