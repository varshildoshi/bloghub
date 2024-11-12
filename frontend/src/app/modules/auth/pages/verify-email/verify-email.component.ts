import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, AfterViewInit {

  email: any;

  constructor(
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private router: Router,
    public commonFunction: CommonFunction,
  ) {
    this.authService.getLoginEmail.subscribe((res: any) => {
      this.email = res.email;
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.authService.verifyEmail(this.email);
  }

  navigateToHomePage() {
    this.commonFunction.closeAllModalBox();
    this.router.navigateByUrl('/');
  }

}
