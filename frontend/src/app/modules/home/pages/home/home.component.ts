import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxSpinnerService } from "ngx-spinner";
import { EMAIL_VERIFICATION_STATUS } from 'src/app/modules/core/helpers/bloghub.config';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePageBanner = 'assets/images/banner/bloghub-home-page-banner.png';

  constructor(
    public router: Router,
    public commonFunction: CommonFunction,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.authService.autoLogin();
    // this.authService.isLoggedIn();

    this.activatedRoute.params.forEach(res => {
      if (res && res.token && JSON.parse(atob(res.token))) {
        const payload = {
          otp: JSON.parse(atob(res.token)).token,
          userId: JSON.parse(atob(res.token)).userId
        };
        this.checkEmaiVerification(payload);
      }
    });
  }

  checkEmaiVerification(payload) {
    this.authService.verifyEmail(payload).subscribe(res => {
      if (res && res.isEmailVerified) {
        this.commonFunction.openVerifyEmailComponent(res.isEmailVerified);
      }
    });
  }

  navigateToBlogs() {
    // this.router.navigateByUrl('blogs');
    this.commonFunction.openSignUpComponent();
  }
}
