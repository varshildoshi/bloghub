import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { EMAIL_VERIFICATION_STATUS, LOCALSTORAGE_TOKEN_NAME, PROVIDER_TYPE } from 'src/app/modules/core/helpers/bloghub.config';
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
  passwordTextType: boolean;
  confirmPasswordTextType: boolean;
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
    private cdr: ChangeDetectorRef,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
  ) {
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
      password: ['', {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)]
      }],
      confirm_password: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)] }],
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

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  confirmTogglePasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  registerWithEmailPassword() {
    this.disable = true;
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(controlName =>
        this.registerForm.controls[controlName].markAsTouched()
      );
      this.disable = true;
      return;
    }

    this.authService.setVerifyData({ email: this.registerForm.value.email });
    this.authService.setAdditionalProfileData({ firstName: this.registerForm.value.firstName, lastName: this.registerForm.value.lastName });

    // Service Call
    this.authService.register(this.registerForm.value).pipe(tap(res => {
      if (res && res.email_verification_sent) {
        this.commonFunction.closeAllModalBox();
        this.commonFunction.openVerifyEmailComponent(EMAIL_VERIFICATION_STATUS.NOT_VERIFIED);
      } else {
        this.toastr.warning(res.message, 'Warning');
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
