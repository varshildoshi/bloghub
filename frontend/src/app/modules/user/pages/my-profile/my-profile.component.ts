import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import { catchError, finalize, map, of, Subscription, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DEFAULT_DISPLAYNAME_PREFIX, DEFAULT_PROFILE_ICON, VERIFIED_NOT_VERIFIED_ICON } from 'src/app/modules/core/helpers/bloghub.config';
import { CommonFunction } from 'src/app/modules/core/common/common-function';
import { environment } from 'src/environments/environment';
import { HttpEventType } from '@angular/common/http';

export interface File {
  data: any,
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  // Public params
  profileForm: FormGroup;
  userSub: Subscription;
  currentUserId;
  currentUserData;
  defaultProfileIcon = DEFAULT_PROFILE_ICON;
  defaultDisplayNamePrefix = DEFAULT_DISPLAYNAME_PREFIX;
  verifiedNotVerifiedICON = VERIFIED_NOT_VERIFIED_ICON;
  url: any;
  photoURL: any;
  currentImageUrl: string;
  selectedFile: File | null = null;
  defaultImage = 'assets/images/avatar/user-profile.png';
  file: File = {
    data: null,
  }
  loading = false;
  successMessage: string = '';

  constructor(
    public fb: FormBuilder,
    public toastr: ToastrService,
    public authService: AuthenticationService,
    public userService: UserService,
    public cd: ChangeDetectorRef,
    public spinner: NgxSpinnerService,
    public commonFunction: CommonFunction
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern())]],
      profilePic: [''],
    });
    this.profileForm.controls.email.disable();
    this.getCurrentUserProfileData();
  }

  getCurrentUserProfileData() {
    this.spinner.show();
    this.userService.getUserProfile(this.authService.getUserID()).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.currentUserId = res.id;
        this.currentUserData = {
          ...res,
        };
        this.profileForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          username: `${res.username ? res.username : res.firstName + res.lastName}`,
          email_verified: res.email_verified,
          profilePic: res.profileImage ? `${environment.baseURL}users/profile-image/${res.profileImage}` : this.defaultImage
        });

      }
    });
  }

  onFileSelected(event) {
    const mimeType = event.target.files[0].type;
    this.url = '';
    if (mimeType !== 'image/png' && mimeType !== 'image/jpeg') {
      return;
    } else {
    }
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);      // read file as data url
      reader.onload = (events: any) => {                // called once readAsDataURL is completed
        this.url = events.target.result;
      };
    }
    this.selectedFile = event.target.files[0];
    this.file = {
      data: event.target.files[0],
    }
    this.uploadProfileImage();
  }

  uploadProfileImage() {
    this.loading = true;
    const formData = new FormData;
    formData.append('file', this.file.data);
    this.userService.uploadProfile(formData).subscribe(res => {
      if (res) {
        this.loading = false;
        this.toastr.success(res.message, 'Success');
        this.getCurrentUserProfileData();
      }
    }), catchError(err => {
      this.toastr.error(err.error.message, 'Error');
      this.loading = false;
      return of(err);
    });
  }

  async submitProfileForm() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(controlName =>
        this.profileForm.controls[controlName].markAsTouched()
      );
      return;
    }

    let payload = {
      id: this.currentUserId,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      username: this.profileForm.value.username,
    }

    this.userService.updateUser(payload).subscribe(res => {
      if (res) {
        this.toastr.success(res.message, 'Success');
        this.getCurrentUserProfileData();
      }
    }), catchError(err => {
      this.toastr.error(err.error.message, 'Error');
      return of(err);
    });
  }

  resetProfileForm() {
    this.getCurrentUserProfileData();
    this.profileForm.markAsUntouched();
  }
}
