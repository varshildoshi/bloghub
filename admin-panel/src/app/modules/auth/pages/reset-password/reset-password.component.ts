import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // Public params
  resetPasswordForm: FormGroup;
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    public commonFunction: CommonFunction,
  ) { }

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
    });
  }

  navigateToLogin() {
    this.commonFunction.closeAllModalBox();
    this.router.navigateByUrl('/');
    this.commonFunction.openSignInComponent();
  }

  /**
   * Reset password submit
   */
  submitForm() {
    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach(controlName =>
        this.resetPasswordForm.controls[controlName].markAsTouched()
      );
      return;
    }

    // this.authService.sendPasswordResetEmail(this.resetPasswordForm.value.email)
    //   .then((res: any) => {
    //     console.log(res);
    //     // this.commonFunction.closeAllModalBox();
    //     // this.router.navigate(['/blogs']);
    //     this.submitted = true;
    //   }).catch(e => {
    //     this.toastr.error(e.message, 'Error');
    //   });
  }

}
