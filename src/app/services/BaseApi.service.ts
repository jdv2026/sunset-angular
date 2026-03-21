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
	protected readonly authServiceUrl = environment.authServiceUrl;
	protected readonly budgetServiceUrl = environment.budgetServiceUrl;

	constructor(
		protected http: HttpClient,
		protected readonly logService: LoggerService,
		protected readonly storageService: StorageService,
	) {}

	/* -------------------------
	* Core HTTP helpers
	* ------------------------- */

	protected authServicePost<T>(params: ApiRequest): Promise<T> {
		return this.post(this.authServiceUrl, params);
	}

	protected budgetServicePost<T>(params: ApiRequest): Promise<T> {
		return this.post(this.budgetServiceUrl, params);
	}

	protected budgetServiceGet<T>(url: string, params?: Record<string, any>): Promise<T> {
		return this.get<T>(this.budgetServiceUrl, url, params);
	}

	protected budgetServicePut<T>(url: string, body?: any): Promise<T> {
		return firstValueFrom(this.put<T>(this.budgetServiceUrl, url, body));
	}

	protected budgetServiceDelete<T>(url: string): Promise<T> {
		return firstValueFrom(this.delete<T>(this.budgetServiceUrl, url));
	}

	protected async get<T>(baseUrl: string, url: string, params?: Record<string, any>): Promise<T> {
		const observable = this.http.get<T>(
			this.buildUrl(baseUrl, url),
			{
				headers: this.buildHeaders(),
				params: this.buildParams(params),
			}
		);
		const res = await firstValueFrom(observable);
		this.logService.debug(url, res);
		return res;
	}

	private async post<T>(baseUrl: string, params: ApiRequest): Promise<T> {
		const observable = this.http.post<T>(
			this.buildUrl(baseUrl, params.url),
			params.payload,
			{ headers: this.buildHeaders() }
		);
		const res = await firstValueFrom(observable);
		this.logService.debug(params.url, res);
		return res;
	}

	protected postFile<T>(data: FormData, url: string): Observable<T> {
		return this.http.post<T>(this.buildUrl(this.authServiceUrl, url), data);
	}


	protected put<T>(baseUrl: string, url: string, body?: any): Observable<T> {
		return this.http.put<T>(
			this.buildUrl(baseUrl, url),
			body,
			{ headers: this.buildHeaders() }
		);
	}

	protected delete<T>(baseUrl: string, url: string): Observable<T> {
		return this.http.delete<T>(
			this.buildUrl(baseUrl, url),
			{ headers: this.buildHeaders() }
		);
	}

	protected upload<T>(
		baseUrl: string,
		url: string,
		formData: FormData,
		params?: Record<string, any>
	): Observable<T> {
		return this.http.post<T>(
			this.buildUrl(baseUrl, url),
			formData,
			{
				headers: this.buildUploadHeaders(),
				params: this.buildParams(params),
			}
		);
	}

	private buildUrl(baseUrl: string, url: string): string {
		return `${baseUrl}${url}`;
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
