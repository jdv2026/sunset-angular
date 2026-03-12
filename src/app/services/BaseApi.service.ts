import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiRequest } from '../contracts/ApiRequest';
import { LoggerService } from './Logger.service';
import { StorageService } from './Storage.service';

@Injectable({
  	providedIn: 'root',
})
export abstract class BaseApiService {
	private useURL = '';
	protected readonly authServiceUrl = environment.authServiceUrl;

	constructor(
		protected http: HttpClient,
		protected readonly logService: LoggerService,
		protected readonly storageService: StorageService,
	) {}

	/* -------------------------
	* Core HTTP helpers
	* ------------------------- */

	protected authServicePost<T>(params: ApiRequest): Promise<T> {
		this.useURL = this.authServiceUrl;
		return this.post(params);
	}

	protected get<T>(url: string, params?: Record<string, any>): Observable<T> {
		return this.http.get<T>(
			this.buildUrl(url),
			{
				headers: this.buildHeaders(),
				params: this.buildParams(params),
			}
		);
	}

	private async post<T>(params: ApiRequest): Promise<T> {
		const observable = this.http.post<T>(
			this.buildUrl(params.url),
			params.payload,
			{ headers: this.buildHeaders() }
		);
		const res = await firstValueFrom(observable);
		this.logService.debug(params.url, res);
		return res;
	}

	protected postFile<T>(data: FormData, url: string): Observable<T> {
		return this.http.post<T>(this.buildUrl(url), data);
	}


	protected put<T>(url: string, body?: any): Observable<T> {
		return this.http.put<T>(
			this.buildUrl(url),
			body,
			{ headers: this.buildHeaders() }
		);
	}

	protected delete<T>(url: string): Observable<T> {
		return this.http.delete<T>(
			this.buildUrl(url),
			{ headers: this.buildHeaders() }
		);
	}

	protected upload<T>(
		url: string,
		formData: FormData,
		params?: Record<string, any>
	): Observable<T> {
		return this.http.post<T>(
			this.buildUrl(url),
			formData,
			{
				headers: this.buildUploadHeaders(),
				params: this.buildParams(params),
			}
		);
	}

	/* -------------------------
	* Helpers
	* ------------------------- */

	private buildUrl(url: string): string {
		return `${this.useURL}${url}`;
	}

	private buildHeaders(): HttpHeaders {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		});

		const token = this.storageService.getToken();

		if (token) {
			headers = headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}

	private buildParams(params?: Record<string, any>): HttpParams | undefined {
		if (!params) return undefined;

		let httpParams = new HttpParams();

		Object.keys(params).forEach(key => {
			if (params[key] !== null && params[key] !== undefined) {
				httpParams = httpParams.set(key, params[key]);
			}
		});

		return httpParams;
	}

	private buildUploadHeaders(): HttpHeaders {
		let headers = new HttpHeaders({
		  'Accept': 'application/json',
		});

		const token = this.storageService.getToken();

		if (token) {
		  	headers = headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}
}
