import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { LoginAuthorizationGuardService } from 'src/app/modules/core/guards/login-authorization-guard-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePageBanner = 'assets/images/banner/bloghub-home-page-banner.png';

  constructor(
    public router: Router,
    public loginAuthorizationGuardService: LoginAuthorizationGuardService,
    public commonFunction: CommonFunction,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  navigateToBlogs() {
    // this.router.navigateByUrl('blogs');
    this.commonFunction.openSignUpComponent();
  }

}
