import { LogLevel } from "src/app/contracts/LogLevel";

export const environment = {
    isProduction: true,
    logLevel: LogLevel.INFO,
    authServiceUrl: 'https://auth.jdvistal.tech/api/',
    budgetServiceUrl: 'https://budget.jdvistal.tech/api/',
	token: 'pr-be-token',
	version: 'dev',
};
  
