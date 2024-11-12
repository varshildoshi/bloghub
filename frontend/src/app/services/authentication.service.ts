// ANGULAR
import { Injectable, Injector, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

// SERVICES

import { BaseService } from './base.service';
import { TokenStorage } from './token-storage.service';

// CONST
import { environment } from 'src/environments/environment';
import { API_PATH } from '../modules/core/constants/api-constant';
import { CommonFunction } from '../modules/core/common/common-function';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { API_CONFIG, PROVIDER_TYPE } from '../modules/core/helpers/bloghub.config';
import { AuthResponseInterface } from '../modules/core/interface/auth-response.interface';

@Injectable()
export class AuthenticationService extends BaseService {

  API_ENDPOINT_CREATE_ACCOUNT = '/create-account';
  public onCredentialUpdated$: Subject<any>;

  private loginEmail = new BehaviorSubject([]);
  getLoginEmail = this.loginEmail.asObservable();

  user$: Observable<any>;

  constructor(
    public http: HttpClient,
    public baseService: BaseService,
    public tokenStorage: TokenStorage,
    protected commonFunction: CommonFunction,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    super(http, tokenStorage, commonFunction);
    this.onCredentialUpdated$ = new Subject();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        console.log('user>>>>', user);
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  /**
   * Verify email id
   */
  setVerifyData(data: any) {
    this.loginEmail.next(data);
  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns Observable<boolean>
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    const accessToken = this.tokenStorage.getAccessToken();
    const isPaid = this.tokenStorage.getPlanStatus();
    const auth: any = {
      isLoggedIn: !accessToken ? false : true,
      isPlanActive: isPaid === 'true' ? true : false
    };
    return of(auth);
  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns Observable<boolean>
   * @memberOf AuthService
   */
  public isAuthorizedAdmin(): Observable<boolean> {
    const userId = this.tokenStorage.getHeaderAdminAccessToken();
    return of(!userId ? false : true);
  }

  public checkUserEmail(email: any): Observable<any> {
    return this.get(`${environment.baseURL}${environment.version}${API_PATH.CHECK_USER_EMAIL}?user_email=${email}`);
  }

  // Login with email-password
  loginWithEmailPassword(userData) {
    return this.http.post<AuthResponseInterface>(`${environment.baseURL}signInWithPassword?key=${API_CONFIG.api_key}`,
      {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true
      });
  }

  // Register with email-password
  registerWithEmailPassword(userData) {
    return this.http.post<any>(`${environment.baseURL}signUp?key=${API_CONFIG.api_key}`,
      {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true
      });
  }

  // Login with Google
  googleAuth() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  // Pop Up Provider // 
  loginWithPopup(provider: any) {
    return this.afAuth.signInWithPopup(provider);
  }

  verifyEmail(email) {
    const actionCodeSettings = {
      url: 'http://localhost:4200/blogs',
      handleCodeInApp: true
    };
    return this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  //Logout
  Logout() {
    this.afAuth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    }, err => {
      console.log(err);
    })
  }

  setUserData(providerType, response) {

    let local_storage_data = this.commonFunction.getIdTokenInLocalStorage();

    let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${local_storage_data.user_id}`);
    const userData = {
      uid: local_storage_data.user_id,
      email: local_storage_data.email,
      displayName: local_storage_data.email,
      photoURL: 'https://www.google.com/imgres?q=google%20images&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100044408950171&imgrefurl=https%3A%2F%2Fwww.facebook.com%2FGoogleIndia%2F&docid=_Qj6mz-Y48rawM&tbnid=8gGkWWfxOPIIWM&vet=12ahUKEwjHjZzC-NGJAxWHjK8BHdQDLqMQM3oECBUQAA..i&w=1080&h=1080&hcb=2&ved=2ahUKEwjHjZzC-NGJAxWHjK8BHdQDLqMQM3oECBUQAA',
      emailVerified: local_storage_data.email_verified
    };
    // this.tokenStorage.setAccessToken(response.credential.idToken);
    return userRef.set(userData, { merge: true });

    // if (providerType === PROVIDER_TYPE.EMAIL_PASSWORD) {
    //   let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${local_storage_data.user_id}`);
    //   console.log('userRef>>>>', userRef);
    //   const userData = {
    //     uid: local_storage_data.user_id,
    //     email: local_storage_data.email,
    //     displayName: local_storage_data.email,
    //     photoURL: '',
    //     emailVerified: local_storage_data.email_verified
    //   };
    //   console.log('userData>>>>>>', userData);
    //   // this.tokenStorage.setAccessToken(response.credential.idToken);
    //   return userRef.set(userData, { merge: true }).then((res) => {
    //     console.log(res);
    //   }).catch(e => {
    //     console.log(e);
    //   });
    // } else if (providerType === PROVIDER_TYPE.GOOGLE) {
    //   let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${response.user.uid}`);
    //   const userData = {
    //     uid: response.user.uid,
    //     email: response.user.email,
    //     displayName: response.user.displayName,
    //     photoURL: response.user.photoURL,
    //     emailVerified: response.user.emailVerified
    //   };
    //   // this.tokenStorage.setAccessToken(response.credential.idToken);
    //   return userRef.set(userData, { merge: true });
    // }

  }

  /**
   * Submit Admin logout request
   * @param Credential: credential
   * @returns Observable<any>
   */
  public adminLogout(credential: any): Observable<any> {
    return this.patch(`${environment.baseURL}${environment.version}${API_PATH.ADMIN_LOGOUT}`, undefined);
  }

  /**
   * Submit login request
   * @param Credential: credential
   * @returns Observable<any>
   */
  public adminLogin(credential): Observable<any> {
    return this.post(`${environment.baseURL}${environment.version}${API_PATH.ADMIN_LOGIN}`, credential).pipe(
      tap(n => this.saveAccessDataAdmin(n))
    );
  }

  /**
   * Submit Direct Login request
   * @param Credential: credential
   * @returns Observable<any>
   */
  directLogin(credential): Observable<any> {
    return this.post(`${environment.baseURL}${environment.version}${API_PATH.DIRECT_LOGIN_POST}`, credential).pipe(
      tap(n => this.saveAccessData(n))
    );
  }

  /**
   * Submit forgotPassword request
   * @param Credential: credential
   * @returns Observable<any>
   */
  public forgotPassword(credential: any): Observable<any> {
    return this.post(`${environment.baseURL}${environment.version}${API_PATH.FORGET_PASSWORD}`, credential);
  }

  /**
   * Submit forgotPassword request
   * @param Credential: credential
   * @returns Observable<any>
   */
  public resendLink(credential: any): Observable<any> {
    return this.post(`${environment.baseURL}${environment.version}${API_PATH.RESEND_LINK}`, credential);
  }

  /**
   * Submit forgotPassword request
   * @param Credential: credential
   * @returns Observable<any>
   */
  public resetPassword(credential: any): Observable<any> {
    return this.http.patch(`${environment.baseURL}${environment.version}${API_PATH.RESET_PASSWORD}`, credential);
  }

  /**
   * Submit checkResetPasswordToken request
   * @param token: query parm
   * @returns Observable<any>
   */
  public checkResetPasswordToken(token: any): Observable<any> {
    return this.http.get(`${environment.baseURL}${environment.version}${API_PATH.RESET_PASSWORD}?usst_reset_token=${token}`);
  }

  /**
   * Submit checkResetPasswordToken request
   * @param token: query parm
   * @returns Observable<any>
   */
  public verifyAccount(token: any): Observable<any> {
    return this.http.get(`${environment.baseURL}${environment.version}${API_PATH.VERIFY_ACCOUNT}?usst_verify_token=${token}`);
  }

  /**
   * Submit Change password
   * @param Credential: credential
   * @returns Observable<any>
   */
  public changePassword(credential: any): Observable<any> {
    return this.http.patch(`${environment.baseURL}${environment.version}${API_PATH.CHANGE_PASSWORD}`, credential);
  }

  /**
   * Update User Information
   * @param Credential: credential
   * @returns Observable<any>
   */
  public getUserDetails() {
    return this.http.get(`${environment.baseURL}${environment.version}${API_PATH.GET_USER_DETAILS}`);
  }

  /**
   * Update User Information
   * @param Credential: credential
   * @returns Observable<any>
   */
  public updateUserDetails(credential: any): Observable<any> {
    return this.http.patch(`${environment.baseURL}${environment.version}${API_PATH.UPDATE_USER_DETAILS}`, credential);
  }

  /**
   * Update Organization Details
   * @param Credential: credential
   * @returns Observable<any>
   */
  public updateOrganizationDetail(credential: any): Observable<any> {
    return this.http.patch(`${environment.baseURL}${environment.version}${API_PATH.UPDATE_ORG}`, credential);
  }

  /**
   * Get Organization Details
   * @returns Observable<any>
   */
  public getOrganizationDetail() {
    return this.http.get(`${environment.baseURL}${environment.version}${API_PATH.GET_ORG}`);
  }


  /**
   * Save access data in the storage
   * @param AccessData: data
   */
  public saveAccessDataAdmin(accessData) {
    if (typeof accessData !== 'undefined') {
      this.tokenStorage
        // .setUserInfo(accessData.data.admin)
        .setAdminAccessToken(accessData.data.token)
        .setRefreshToken('')
        .setIsAdmin('true')
        .setAdminUserID(accessData.data.admin.admin_id);
      this.onCredentialUpdated$.next(accessData);
    }
    return this;
  }

  /**
   * Save access data in the storage
   * @param AccessData: data
   */
  public saveAccessData(accessData) {
    console.log('call>>>>>>>>>>>');
    if (typeof accessData !== 'undefined') {
      this.tokenStorage
        // .setUserInfo(accessData.data.user)
        .setAccessToken(accessData.data.token)
        .setRefreshToken('')
        .setIsAdmin('false')
        .setUserID(accessData.data.user.user_id)
        .setOrganizationID(accessData.data.user.usorg_org_id)
        .setUserOrganizationRoleID(accessData.data.user.usorg_orgrl_id);
      this.onCredentialUpdated$.next(accessData);
    }
    return this;
  }

  /**
   * Save User Payment Details
   * @param payload: payload
   */
  public userPayment(paymentDetails): Observable<any> {
    return this.patch(`${environment.baseURL}${environment.version}${API_PATH.UPDATE_USER_PAYMENT}`, paymentDetails);
  }

  tokenRegister(jwtToken: string, credential): Observable<any> {
    return this.http.post(`${environment.baseURL}create-account`, {
      name: credential.name,
      email: credential.email,
      company: credential.company,
      title: credential.title,
      businessFunction: credential.businessFunction,
      noOfUsers: credential.noOfUsers,
      plan: credential.plan,
      token: jwtToken
    });
  }
}
