import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../common/common-function';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DEFAULT_PROFILE_ICON } from '../../helpers/bloghub.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';

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
  profileData;
  defaultImage = 'assets/images/avatar/user-profile.png';

  constructor(
    public commonFunction: CommonFunction,
    public activeModal: NgbActiveModal,
    public authService: AuthenticationService,
    public router: Router,
    public cd: ChangeDetectorRef,
    public userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.extractAccessTokenForUser().subscribe((res: any) => {
      if (res) {
        this.currentUser = {
          ...res,
          profilePic: res.profileImage ? `${environment.baseURL}users/profile-image/${res.profileImage}` : this.defaultImage
        };
        this.isAuthenticated = true;
        this.cd.detectChanges();
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.cd.detectChanges();
      }
    });
  }

  getCurrentUserProfileData() {
    if (this.authService.getUserID()) {
      this.userService.getUserProfile(this.authService.getUserID()).subscribe((res: any) => {
        if (res) {
          this.currentUser = {
            ...res,
            profilePic: res.profileImage ? `${environment.baseURL}users/profile-image/${res.profileImage}` : this.defaultImage
          };
          this.isAuthenticated = true;
          this.cd.detectChanges();
        } else {
          this.currentUser = null;
          this.isAuthenticated = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  ngAfterContentChecked() {
    this.getCurrentUser();
  }

  navigateToSignIn() {
    this.commonFunction.closeAllModalBox();
    this.commonFunction.openSignInComponent();
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.cd.detectChanges();
    this.authService.logout();
  }

  ngOnDestroy() {
  }

}
