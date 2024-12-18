// ANGULAR
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { BehaviorSubject, from, map, Observable, of, Subject, tap } from 'rxjs';

// SERVICES
import { TokenStorage } from './token-storage.service';

// COMMON FUNCTION
import { CommonFunction } from '../modules/core/common/common-function';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthLoginUser, User, User1 } from '../modules/core/models/bloghub.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from 'src/environments/environment';
import { EMAIL_VERIFICATION_STATUS } from '../modules/core/helpers/bloghub.config';
import { jwtDecode } from "jwt-decode";

@Injectable()
export class AuthenticationService {

  private loginEmail = new BehaviorSubject([]);
  getLoginEmail = this.loginEmail.asObservable();

  // private additionalProfileData = new BehaviorSubject({ firstName: '', lastName: '' });
  // getAdditionalProfileData = this.additionalProfileData.asObservable();

  constructor(
    public http: HttpClient,
    public tokenStorage: TokenStorage,
    public commonFunction: CommonFunction,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
  }

  /**
   * Verify email id
   */
  setVerifyData(data: any) {
    this.loginEmail.next(data);
  }

  /**
   * Set additional profile data
   */
  setAdditionalProfileData(data: any) {
    localStorage.setItem(btoa('AdditionalProfileData'), JSON.stringify(data));
  }

  /**
   * Get additional profile data
   */
  getAdditionalProfileData() {
    const profile = localStorage.getItem(btoa('AdditionalProfileData'));
    return JSON.parse(profile);
  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns Observable<boolean>
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    const accessToken = this.tokenStorage.getAccessToken();
    const auth: any = {
      isLoggedIn: !accessToken ? false : true,
    };
    return of(auth);
  }

  /**
   * Submit register request
   * @param data: user entered data
   * @returns Observable<any>
   */
  public register(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'users/register', data).pipe(
      tap(n => this.saveAccessData(n))
    );
  }

  /**
     * Submit login request
     * @param Credential: credential
     * @returns Observable<any>
     */
  public login(payload: any): Observable<any> {
    return this.http.post(environment.baseURL + 'users/login', payload).pipe(
      tap(n => this.saveAccessData(n))
    );
  }

  /**
     * Verify email request
     * @param Credential: credential
     * @returns Observable<any>
     */
  public verifyEmail(payload): Observable<any> {
    return this.http.post(`${environment.baseURL}users/verify`, payload);
  }

  /**
   * Get user id from tokenstorage
   */
  getUserID() {
    return this.tokenStorage.getUserID();
  }

  public saveAccessData(accessData) {
    if (typeof accessData !== 'undefined') {
      this.tokenStorage
        .setAccessToken(accessData.access_token)
        .setUserID(accessData.id)
        .setIsLoggedIn(accessData.isLoggedIn)
      this.extractAccessTokenForUser();
    }
    return this;
  }

  /**
   * Decode access token from localstorage
   */
  extractAccessTokenForUser(): Observable<any[]> {
    let isLoggedIn = Boolean(this.tokenStorage.getIsLoggedIn());
    if (isLoggedIn) {
      let jwt = localStorage.getItem(btoa('access_token'));
      let decodedJwtData = JSON.parse(window.atob(jwt.split('.')[1]));
      return of(decodedJwtData.user);
    } else {
      return of(null);
    }
  }

  /**
   * Logout
   */
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
