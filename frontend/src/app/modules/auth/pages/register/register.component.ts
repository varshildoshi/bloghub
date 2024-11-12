import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { LOCALSTORAGE_TOKEN_NAME, PROVIDER_TYPE } from 'src/app/modules/core/helpers/bloghub.config';
import { getUserDetails } from 'src/app/modules/core/helpers/jwt.helper';
import { MustMatchValidators } from 'src/app/modules/core/helpers/MatchValidator';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // Public params
  registerForm: FormGroup;
  hide = true;
  loading = false;
  errorMessage: any;
  errors: any = [];
  subscriptions: Subscription[] = [];
  private unsubscribe: Subject<any>;
  apiError: string = '';
  apiMessage: string = '';
  passwordTextType: boolean;
  confirmPasswordTextType: boolean;

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
    private toastr: ToastrService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      // username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
      password: ['', {
        validators: [Validators.required]
      }],
      confirm_password: ['', { validators: [Validators.required] }],
    }, {
      validator: MustMatchValidators('password', 'confirm_password')
    });
  }

  /**
   * Go to login page
   */
  navigateToSignIn() {
    this.activeModal.close();
    this.commonFunction.openSignInComponent();
  }

  checkWhiteSpace(event: any) {
    if (event && event.code === 'Space' && event.keyCode === 32) {
      event.preventDefault();
    }
  }


  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  confirmTogglePasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  registerWithGoogle() {
    this.authService.googleAuth().then(res => {
      console.log('registerWithGoogle:::::', res);
      this.authService.setUserData(PROVIDER_TYPE.GOOGLE, res);
      this.commonFunction.closeAllModalBox();
      this.router.navigate(['/blogs']);
    }).catch(err => {
      this.toastr.error(err, 'Error');
    });
  }

  registerWithEmailPassword() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(controlName =>
        this.registerForm.controls[controlName].markAsTouched()
      );
      return;
    }

    this.authService.registerWithEmailPassword(this.registerForm.value).subscribe(
      async res => {
        console.log('registerWithEmailPassword>>>>>', res);
        await this.commonFunction.setIdTokenInLocalStorage(res.idToken);
        const user = this.commonFunction.getIdTokenInLocalStorage();
        console.log(user);

        let payload = {
          uid: user.user_id,
          email: user.email,
          displayName: user.displayName ? user.displayName : '',
          photoURL: user.photoURL ? user.photoURL : '',
          emailVerified: user.email_verified ? user.email_verified : false
        };

        this.authService.setUserData(PROVIDER_TYPE.EMAIL_PASSWORD, payload);

        // this.authService.setVerifyData({ email: this.registerForm.value.email });
        // this.authService.setUserData(PROVIDER_TYPE.EMAIL_PASSWORD, res);
        // this.verifyEmail();
        // this.router.navigate(['/blogs']);
      }, err => {
        console.log(err);
        this.toastr.error(err.error.error.message, 'Error');
      });
  }

  verifyEmail() {
    const user = this.commonFunction.getIdTokenInLocalStorage();
    // console.log(user);
    this.commonFunction.closeAllModalBox();
    this.commonFunction.openVerifyEmailComponent();
  }

  /**
   * Form Submit
   */
  onSubmit() {
    // Check form valid
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(controlName =>
        this.registerForm.controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;
    // this.authService.register(this.registerForm.value).pipe(tap(res => {
    //   if (res) {
    //     // Navigate to Dashbord.
    //     this.router.navigate(['/auth/login']);
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
   * On destroy
   */
  ngOnDestroy(): void {
    // this.authNoticeService.setNotice(null);
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    this.loading = false;
  }

}
