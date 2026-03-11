import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class StorageService {
	private readonly TOKEN_KEY = 'pr-be-token';

	constructor() {}

	/**
	 * Save the token in sessionStorage
	 * @param token JWT token
	 */
	setToken(token: string): void {
		sessionStorage.setItem(this.TOKEN_KEY, token);
	}

	/**
	 * Get the token from sessionStorage
	 * @returns token or null if not present
	 */
	getToken(): string | null {
		return sessionStorage.getItem(this.TOKEN_KEY);
	}

	/**
	 * Remove the token from sessionStorage
	 */
	clearToken(): void {
		sessionStorage.removeItem(this.TOKEN_KEY);
	}

	/**
	 * Check if a token exists
	 */
	hasToken(): boolean {
		return !!this.getToken();
	}
}
