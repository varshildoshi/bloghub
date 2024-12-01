import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { emailPattern } from 'src/app/modules/core/helpers/validation.helper';
import * as firebase from 'firebase/auth';
import { finalize, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DEFAULT_DISPLAYNAME_PREFIX, DEFAULT_PROFILE_ICON, VERIFIED_NOT_VERIFIED_ICON } from 'src/app/modules/core/helpers/bloghub.config';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      email: ['', { disabled: true }, [Validators.required, Validators.pattern(emailPattern())]],
      photoURL: [''],
    });

    this.userSub = this.authService.user.subscribe(async (res: any) => {
      if (res) {
        this.currentUserId = res.uid;
        // this.currentImageUrl = await this.storage.ref(res.photoURL)
        //   .getDownloadURL()
        //   .toPromise();

        console.log(this.currentUserId);
        this.cd.detectChanges();
      } else {
        this.currentUserId = null;
        this.cd.detectChanges();
      }
    });
    this.setProfileFormData();
  }

  setProfileFormData() {
    this.userService.getProfileData(this.currentUserId).subscribe((res: any) => {
      console.log(res);
      this.spinner.hide();
      this.profileForm.patchValue({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        displayName: `${res.displayName ? res.displayName : res.firstName + res.lastName}`,
        emailVerified: res.emailVerified,
        photoURL: res.photoURL,
        uid: res.uid
      });
      this.currentUserData = {
        ...res,
      };
    });
  }

  checkWhiteSpace(event: any) {
    if (event && event.code === 'Space' && event.keyCode === 32) {
      event.preventDefault();
    }
  }

  onFileSelected(event) {                                 // called each time file input changes
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
  }

  resetProfileForm() {
    this.setProfileFormData();
    this.profileForm.markAsUntouched();
  }

  async submitProfileForm() {
    // if (this.photoURL.length) {
    //   const file = this.photoURL[0];
    //   const fullPathInStorage = await this.uploadImage(this.currentUserId, file);

    //   this.currentImageUrl = await this.storage
    //     .ref(fullPathInStorage)
    //     .getDownloadURL()
    //     .toPromise();
    // }

    this.uploadToFirebase();
  }

  async uploadImage(uid, file): Promise<string> {
    const fileRef = this.storage.ref(uid).child(file.name);
    if (!!file) {
      const result = await fileRef.put(file);
      return result.ref.fullPath;
    }
  }

  uploadToFirebase() {
    if (this.selectedFile) {
      const filePath = `profileImages/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log('Firebase URL:', url);
          });
        })
      ).subscribe();
    }
  }

}
