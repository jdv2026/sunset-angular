import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiError } from 'src/app/contracts/ApiError';

@Injectable({ providedIn: 'root' })
export class ErrorStateService {

	private _hasError$ = new BehaviorSubject<boolean>(false);
	hasError$ = this._hasError$.asObservable();

	private _apiError$ = new BehaviorSubject<ApiError | null>(null);
	apiError$ = this._apiError$.asObservable();

	setError(value: boolean) {
		this._hasError$.next(value);
	}

	setApiError(error: ApiError | null) {
		this._apiError$.next(error);
	}

	get currentError(): boolean {
		return this._hasError$.getValue();
	}

	get currentApiError(): ApiError | null {
		return this._apiError$.getValue();
	}
}
