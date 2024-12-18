import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Public params
  loginForm: FormGroup;
  passwordTextType: boolean;
  disable = false;

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
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
      password: ['', {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)]
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

  /**
   * Go to reset password page
   */
  navigateToResetPassword() {
    this.activeModal.close();
    this.commonFunction.openResetPasswordComponent();
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Login With Email-Password
   */
  loginWithEmailPassword() {
    this.disable = true;
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(controlName =>
        this.loginForm.controls[controlName].markAsTouched()
      );
      this.disable = true;
      return;
    }

    this.authService.setVerifyData({ email: this.loginForm.value.email });
    this.authService.login(this.loginForm.value).pipe(tap(res => {
      if (res) {
        // Navigate to Blogs.
        this.router.navigate(['/blogs']);
        this.commonFunction.closeAllModalBox();
        this.toastr.success('Enjoy BlogHub', 'Welcome');
      } else {
      }
    }),
      catchError(err => {
        this.disable = false;
        return of(err.error.message);
      }),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }


}
