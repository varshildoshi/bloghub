import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { EMAIL_VERIFICATION_STATUS } from 'src/app/modules/core/helpers/bloghub.config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  email: any;
  @Input() public modalStatus;
  emailVerificationStatus = EMAIL_VERIFICATION_STATUS;

  constructor(
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private router: Router,
    public commonFunction: CommonFunction,
    public activatedRoute: ActivatedRoute
  ) {
    this.authService.getLoginEmail.subscribe((res: any) => {
      this.email = res.email;
    });
  }

  ngOnInit(): void {
  }

  navigateToLogin() {
    this.commonFunction.closeAllModalBox();
    this.router.navigateByUrl('/');
    this.commonFunction.openSignInComponent();
  }

}
