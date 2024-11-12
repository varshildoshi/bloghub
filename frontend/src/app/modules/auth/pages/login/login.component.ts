import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { CustomValidators } from 'src/app/modules/core/helpers/MatchValidator';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PROVIDER_TYPE } from 'src/app/modules/core/helpers/bloghub.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Public params
  loginForm: FormGroup;
  hide = true;
  loading = false;
  errorMessage: any;
  errors: any = [];
  subscriptions: Subscription[] = [];
  private unsubscribe: Subject<any>;
  passwordTextType: boolean;

  /**
   * Component constructor
   *
   * @param router: Router
   * @param store: Store<AppState>
   * @param cdr: cdr
   * @param route: route
   */
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
      password: ['', {
        validators: [Validators.required]
      }],
    });
  }

  /**
   * Go to register page
   */
  navigateToSignUp() {
    this.activeModal.close();
    this.commonFunction.openSignUpComponent();
  }

  checkWhiteSpace(event: any) {
    if (event && event.code === 'Space' && event.keyCode === 32) {
      event.preventDefault();
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Form Submit
   */
  onSubmit() {
    // Check form valid
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(controlName =>
        this.loginForm.controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    // this.authService.login(this.loginForm.value).pipe(tap(res => {
    //   if (res) {
    //     // Navigate to Dashbord.
    //     this.router.navigate(['/dashboard']);
    //   } else {
    //     // this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
    //   }
    // }),
    //   catchError(err => {
    //     if (err.error.msg_code === 114) {
    //       this.errorMessage = err;
    //     }
    //     // this.authNoticeService.setNotice(err.error.message, 'error');
    //     return of(err);
    //   }),
    //   takeUntil(this.unsubscribe),
    //   finalize(() => {
    //     this.loading = false;
    //     this.cdr.markForCheck();
    //   })
    // ).subscribe();
  }

  /**
   * Login With Google
   */
  loginWithGoogle() {
    this.authService.googleAuth().then(res => {
      console.log(res);
      this.authService.setUserData(PROVIDER_TYPE.GOOGLE, res);
      this.commonFunction.closeAllModalBox();
      this.router.navigate(['/blogs']);
    }).catch(err => {
      this.toastr.error(err, 'Error');
    });
  }

  /**
   * Login With Email-Password
   */
  loginWithEmailPassword() {
    const { email, password } = this.loginForm.value;

    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(controlName =>
        this.loginForm.controls[controlName].markAsTouched()
      );
      return;
    }
    this.authService.loginWithEmailPassword(this.loginForm.value).subscribe(
      async res => {
        console.log(res);
        await this.commonFunction.setIdTokenInLocalStorage(res.idToken);
        // this.authService.setUserData(PROVIDER_TYPE.EMAIL_PASSWORD, res);
        // this.commonFunction.closeAllModalBox();
        this.router.navigate(['/blogs']);
      }, err => {
        console.log(err);
        this.toastr.error(err.error.error.message, 'Error');
      });

    // this.commonFunction.closeAllModalBox();
    // this.userService.addUser({ uid, email, displayName: email });
    // this.router.navigate(['/blogs']);

    // catch((err) => {
    //   console.log(err.error);
    //   this.toastr.error(err.message, 'Error');
    // });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // this.authNoticeService.setNotice(null);
    // this.unsubscribe.next(true);
    // this.unsubscribe.complete();
    this.loading = false;
  }


}
