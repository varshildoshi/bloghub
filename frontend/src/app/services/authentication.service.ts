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

import { ActivatedRoute, Router } from '@angular/router';
import { AuthLoginUser, User, User1 } from '../modules/core/models/bloghub.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { FirebaseError } from 'firebase/app';
import * as auth from 'firebase/auth';

@Injectable()
export class AuthenticationService extends BaseService {

  private loginEmail = new BehaviorSubject([]);
  getLoginEmail = this.loginEmail.asObservable();

  // private additionalProfileData = new BehaviorSubject({ firstName: '', lastName: '' });
  // getAdditionalProfileData = this.additionalProfileData.asObservable();

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  userdata = null
  userData: any;
  isAuthenticated = false;
  LoginData = new BehaviorSubject<any>(null);

  constructor(
    public http: HttpClient,
    public baseService: BaseService,
    public tokenStorage: TokenStorage,
    protected commonFunction: CommonFunction,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    super(http, tokenStorage, commonFunction);

    this.afAuth.authState.subscribe(user => {
      if (user && user.emailVerified) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        // localStorage.clear();
      }
    })
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
   * Sign-in/Sign-up with google
   */
  googleAuth() {
    this.spinner.show();
    return new Promise<any>((resolve, reject) => {
      let provider = new GoogleAuthProvider();
      this.afAuth
        .signInWithPopup(provider)
        .then((res: any) => {

          // const firstName = res.additionalUserInfo.profile.given_name;
          // const lastName = res.additionalUserInfo.profile.family_name;

          // console.log('firstName>>>', firstName);
          // console.log('lastName>>>', lastName);

          this.handleAuthentication(
            res.user.email,
            res.user.uid,
            res.user.refreshToken,
            +360000
          );
          this.spinner.hide();
          this.router.navigate(['/blogs']);
          resolve(res);
        }, err => {
          this.spinner.hide();
          // this.toastr.error(err, 'Error'); // no need to show this toastr
          reject(err);
        })
    })
  }

  /**
   * Sign-up with email-password
   */
  registerWithEmailPassword(payload) {
    this.spinner.show();
    return this.afAuth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((result) => {
        console.log(result);
        this.spinner.hide();
        this.sendVerificationMail();
      })
      .catch(err => {
        this.spinner.hide();
        this.toastr.error(err, 'Error');
      })
  }

  /**
   *  Sign-in with email-password
   */
  loginWithEmailPassword(payload) {
    this.spinner.show();
    return this.afAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then((result) => {
        this.spinner.hide();
        this.LoginData.next(result)

        if (result.user.emailVerified !== true) {
          this.sendVerificationMail();
        }
        else {
          this.setUserData(result.user);
          setTimeout(() => {
            this.router.navigate(['/blogs']);
          }, 100);
        }
      })
      .catch(err => {
        this.spinner.hide();
        this.toastr.error(err, 'Error');
      })
  }

  /**
   * Send email for user verification
   */
  async sendVerificationMail() {
    this.spinner.show();
    return (await this.afAuth.currentUser).sendEmailVerification()
      .then(() => {
        this.spinner.hide();

        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        // localStorage.clear();

        this.commonFunction.openVerifyEmailComponent();
      })
      .catch(err => {
        this.spinner.hide();
        this.toastr.error(err, 'Error');
      })
  }

  /**
   * Send Password Reset Email Link with Forgot password
   */
  async sendPasswordResetEmail(email: string) {
    this.spinner.show();
    return await this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.spinner.hide();
        if (this.isAuthenticated) {
          this.logout();
        }
        // this.router.navigate(['/']);
      })
      .catch(err => {
        this.spinner.hide();
        this.toastr.error(err, 'Error');
      })
  }

  /**
   * Set user data to firebase
   */
  setUserData(user) {
    const profile = this.getAdditionalProfileData();
    console.log('profile>>>>>', profile);
    console.log(user);

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User1 = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      firstName: user.firstName ? user.firstName : profile ? profile.firstName : '',
      lastName: user.lastName ? user.lastName : profile ? profile.lastName : '',
    }

    this.afAuth.authState.subscribe(user => {
      if (user && user.emailVerified) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        const user1 = JSON.parse(localStorage.getItem('user'));
        this.user.next(user1);
      } else {
        // this.clearLocalStorage();
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        localStorage.clear();
      }
    })
    localStorage.removeItem(btoa('AdditionalProfileData'));
    return userRef.set(userData, {
      merge: true
    })
  }



  /**
   * Auto login
   */
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  /**
   * Auto logout
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Logout
   */
  logout() {
    this.spinner.show();
    this.afAuth.signOut().then(() => {

      localStorage.removeItem('user');
      localStorage.removeItem('userData');

      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
      this.spinner.hide();
      window.location.href = '/';
    })
      .catch(err => {
        this.spinner.hide();
        this.toastr.error(err, 'Error');
      })
  }

  /**
   * Is logged in
   */
  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user.next(user);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /**
   * Handle Authentication for expiration Date
   */
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.userdata = user;
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuthenticated = true;

  }



  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns Observable<boolean>
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    const user = JSON.parse(localStorage.getItem('user'));
    const auth: any = {
      isLoggedIn: !user ? false : true
    };
    return of(auth);
  }

  clearLocalStorage() {
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.clear();
  }
}
