import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorage } from './token-storage.service';
import { CommonFunction } from '../modules/core/common/common-function';

@Injectable()
export class BaseService {

    constructor(
        protected httpClient: HttpClient,
        protected tokenStorage: TokenStorage,
        protected commonFunction: CommonFunction) {
    }

    protected get<T>(url: string, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .get<T>(url, { headers: this.getAllHeaders(headers) });
    }

    protected post<T>(url: string, body: any, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .post<T>(url, this.commonFunction.removeUnwantedKey(body), { headers: this.getAllHeaders(headers) });
    }

    protected upload<T>(url: string, body: any, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .post<T>(url, body, { headers: this.getFileUploadHeader(headers) });
    }

    protected put<T>(url: string, body: string, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .put<T>(url, this.commonFunction.removeUnwantedKey(body), { headers: this.getAllHeaders(headers) });
    }

    protected delete<T>(url: string, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .delete<T>(url, { headers: this.getAllHeaders(headers) });
    }

    protected patch<T>(url: string, body: string, headers: HttpHeaders = null): Observable<T> {
        return this.httpClient
            .patch<T>(url, this.commonFunction.removeUnwantedKey(body), { headers: this.getAllHeaders(headers) });
    }

    private getFileUploadHeader(headers: HttpHeaders = null): HttpHeaders {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'multipart/form-data');
        }

        if (!headers.has('Authorization')) {
            const accessToken = this.tokenStorage.getAccessToken();
            if (accessToken) {
                headers.set('Authorization', 'Bearer ' + accessToken);
            }
        }
        return headers;
    }

    private getAllHeaders(headers: HttpHeaders = null): HttpHeaders {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json');
        }

        if (!headers.has('Authorization')) {
            const accessToken = this.tokenStorage.getAccessToken();
            // console.log('accessToken', accessToken);
            if (accessToken) {
                headers.set('Authorization', 'Bearer ' + accessToken);
            }
        }
        return headers;
    }
}
