// ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';

// SERVICES
import { BaseService } from './base.service';
import { TokenStorage } from './token-storage.service';

// COMMON FUNCTION
import { CommonFunction } from '../modules/core/common/common-function';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';
import { AuthLoginUser, User } from '../modules/core/models/bloghub.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { FirebaseError } from 'firebase/app';
import * as auth from 'firebase/auth';
import { LOCALSTORAGE_TOKEN_NAME } from '../modules/core/helpers/bloghub.config';

@Injectable()
export class AuthenticationService extends BaseService {

  public onCredentialUpdated$: Subject<any>;

  private loginEmail = new BehaviorSubject([]);
  getLoginEmail = this.loginEmail.asObservable();

  loginResponse = new BehaviorSubject<any>(null);
  userInfo = new BehaviorSubject<User>(null);

  isAuthenticated = false;
  private tokenExpirationTimer: any;

  constructor(
    public http: HttpClient,
    public baseService: BaseService,
    public tokenStorage: TokenStorage,
    protected commonFunction: CommonFunction,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    super(http, tokenStorage, commonFunction);
    this.onCredentialUpdated$ = new Subject();

    this.saveUserAuthStateToLocalStorage();
  }

  saveUserAuthStateToLocalStorage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem(`${LOCALSTORAGE_TOKEN_NAME.name}`, JSON.stringify(user));
        const user1 = JSON.parse(localStorage.getItem(`${LOCALSTORAGE_TOKEN_NAME.name}`));
        this.userInfo.next(user1);
      } else {
        // this.logout();
        this.userInfo.next(null);
        this.loginResponse.next(null);
        localStorage.clear();
        this.tokenExpirationTimer = null;
        this.router.navigate(['/']);
      }
    })
  }

  /**
   * Verify email id
   */
  setVerifyData(data: any) {
    this.loginEmail.next(data);
  }

  // Login with email-password
  loginWithEmailPassword(userData) {
    this.spinner.show();
    return this.afAuth.signInWithEmailAndPassword(userData.email, userData.password)
    .then((result) => {
      console.log(result);
      this.spinner.hide();
      this.loginResponse.next(result);
      
      if (result.user.emailVerified !== true) {
        // this.commonFunction.closeAllModalBox();
        this.SendVerificationMail();
      }
      else {
        // this.handleAuthentication(
        //   result.user.email,
        //   result.user.uid,
        //   result.user.refreshToken,
        //   // +360000
        //   +172800
        // );
        setTimeout(() => {
          this.setUserData(result.user);
          // this.router.navigate(['/blogs']);
        }, 100);
        }
      }).catch((e) => {
        this.spinner.hide();
        this.toastr.error(e, 'Error');
      })
  }

  // Register with email-password
  registerWithEmailPassword(userData) {
    this.spinner.show();
    return this.afAuth.createUserWithEmailAndPassword(userData.email, userData.password)
      .then((result) => {
        this.logout();
        this.commonFunction.closeAllModalBox();
        this.SendVerificationMail();
      })
      // .catch(function(err: FirebaseError) {
      //   console.log(JSON.parse(JSON.stringify(err)));
      // })
      .catch(e => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      })
  }

  // Login with Google
  googleAuth() {
    this.spinner.show();
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .signInWithPopup(new GoogleAuthProvider())
        .then(res => {
          this.handleAuthentication(
            res.user.email,
            res.user.uid,
            res.user.refreshToken,
            // +360000
            +172800
          );
          this.loginResponse.next(res);
          this.setUserData(res.user);
          this.spinner.hide();
          this.router.navigate(['/blogs']);
          resolve(res);
        }, err => {
          this.spinner.hide();
          reject(err);
        });
    });
  }

  async SendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification()
      .then(() => {
        this.spinner.hide();
        this.commonFunction.openVerifyEmailComponent();
      })
      .catch(e => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      })

  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    // this.userdata = user;
    this.userInfo.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuthenticated = true;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      // this.logout();
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userInfo.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }

  logout() {
    this.spinner.show();
    this.afAuth.signOut().then(() => {
      this.userInfo.next(null);
      this.loginResponse.next(null);
      localStorage.clear();
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
      this.spinner.hide();
      this.router.navigate(['/']);
    }).catch((e) => {
      this.spinner.hide();
      this.toastr.error(e, 'Error');
    })
  }

  setUserData(user) {
    console.log('setUserData>>>>', user);
    if (user) {
      let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userData: AuthLoginUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      this.saveUserAuthStateToLocalStorage();
      return userRef.set(userData, { merge: true });
    }
  }

  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem(`${LOCALSTORAGE_TOKEN_NAME.name}`));
    this.userInfo.next(user);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  checkUserIsAuthorized(): Observable<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem(`${LOCALSTORAGE_TOKEN_NAME.name}`));
    if (!user) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns Observable<boolean>
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    const user = JSON.parse(localStorage.getItem(`${LOCALSTORAGE_TOKEN_NAME.name}`));
    const auth: any = {
      isLoggedIn: !user ? false : true
    };
    return of(auth);
  }

  /**
   * Update User Information
   * @param Credential: credential
   * @returns Observable<any>
   */
  // public getUserDetails() {
  //   return this.http.get(`${environment.baseURL}${environment.version}${API_PATH.GET_USER_DETAILS}`);
  // }

  /**
   * Update User Information
   * @param Credential: credential
   * @returns Observable<any>
   */
  // public updateUserDetails(credential: any): Observable<any> {
  //   return this.http.patch(`${environment.baseURL}${environment.version}${API_PATH.UPDATE_USER_DETAILS}`, credential);
  // }

  /**
   * Save access data in the storage
   * @param AccessData: data
   */
  // public saveAccessDataAdmin(accessData) {
  //   if (typeof accessData !== 'undefined') {
  //     this.tokenStorage
  //       // .setUserInfo(accessData.data.admin)
  //       .setAdminAccessToken(accessData.data.token)
  //       .setRefreshToken('')
  //       .setIsAdmin('true')
  //       .setAdminUserID(accessData.data.admin.admin_id);
  //     this.onCredentialUpdated$.next(accessData);
  //   }
  //   return this;
  // }

  /**
   * Save access data in the storage
   * @param AccessData: data
   */
  public saveAccessData(accessData) {
    if (typeof accessData !== 'undefined') {
      this.tokenStorage
        // .setUserInfo(accessData.data.user)
        .setAccessToken(accessData.data.token)
        .setUserID(accessData.data.user.user_id)
      this.onCredentialUpdated$.next(accessData);
    }
    return this;
  }
}
