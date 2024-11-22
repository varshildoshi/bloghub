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

    this.authService.setVerifyData({ email: this.registerForm.value.email });
    this.authService.registerWithEmailPassword(this.registerForm.value).then(d => {
      
    }).catch(e => {
      // console.log(e);
      // this.toastr.error(e.message, 'Error');
    });
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
