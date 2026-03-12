import { LogLevel } from "src/app/contracts/LogLevel";

export const environment = {
    isProduction: false,
    logLevel: LogLevel.DEBUG,
    authServiceUrl: 'http://localhost:9999/api/',
	token: 'pr-be-token',
};
