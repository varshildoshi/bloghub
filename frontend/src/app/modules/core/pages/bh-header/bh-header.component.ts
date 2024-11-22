import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { CommonFunction } from '../../common/common-function';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DEFAULT_PROFILE_ICON } from '../../helpers/bloghub.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bh-header',
  templateUrl: './bh-header.component.html',
  styleUrls: ['./bh-header.component.scss']
})
export class BhHeaderComponent implements OnInit {

  closeResult = '';

  currentUser;
  isAuthenticated: Observable<boolean> | boolean = false;
  defaultProfileIcon = DEFAULT_PROFILE_ICON;

  constructor(
    public commonFunction: CommonFunction,
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  getUserAuthState() {
    this.isAuthenticated = this.authService.checkUserIsAuthorized();

    // console.log(this.isAuthenticated);

    this.authService.userInfo.subscribe(res => {
      if (res) {
        this.currentUser = res;
        this.cd.detectChanges();
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.cd.detectChanges();
      }
    });
  }

  ngDoCheck() {
    this.getUserAuthState();
  }

  navigateToSignIn() {
    this.commonFunction.closeAllModalBox();
    this.commonFunction.openSignInComponent();
  }

  logout() {
    // this.getUserAuthState();
    this.authService.logout();
    // this.router.navigateByUrl('/');
  }

}
