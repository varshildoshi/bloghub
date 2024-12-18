import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, Observable, of } from 'rxjs';
import { TokenStorage } from './token-storage.service';
import { ERROR_CODE } from './auth-interceptor.constant';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    public tokenStorage: TokenStorage,
    public spinner: NgxSpinnerService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Loading spinner.
    this.spinner.show();
    // Get Token.
    const token = this.tokenStorage.getHeaderAccessToken();

    if (token) {
      request = request.clone(this.setAuthorization(request, token));
    }

    // if (!request.headers.has('Content-Type')) {
    //     request = request.clone(this.setContentType(request));
    // }

    return next.handle(request).pipe(
      catchError((error, caught) => {
        this.spinner.show();
        this.handleAuthError(error);
        return of(error);
      }) as any,
      finalize(() =>
        this.spinner.hide())
    );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {

    switch (err.status) {
      case ERROR_CODE.ERROR_401:
        localStorage.clear();
        this.router.navigate(['/']);
        this.toastr.error(`${err.error.message}! Please login. Session is expired..`, 'Error');
        break;
    }
    this.toastr.error(`${err.error.message}`, 'Error');
    throw err;
  }

  setAuthorization(request, token) {
    return { headers: request.headers.set('Authorization', 'Bearer ' + token) };
  }
}
