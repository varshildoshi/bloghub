import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunction } from '../../common/common-function';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput;
  @Input() form;
  @Input() controlName;
  @Input() fileExtensions;
  @Input() disabled;
  @Output() valueChange = new EventEmitter<any>();
  defaultImage = 'assets/images/avatar/user-profile.png';
  uploadedImage: any = '';
  public imageFile: any = '';
  public imageFileError = false;
  public imageErrorMsg: string = '';

  constructor(
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private commonFunction: CommonFunction
  ) { }

  ngOnInit() {

  }

  fileChange(event: any) {
    const self = this;
    this.imageFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const filelist: FileList = event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // file type validation check
      if (!this.commonFunction.validateImageFile(this.imageFile.name)) {
        this.imageFileError = true;
        this.imageErrorMsg = 'Only jpg, jpeg and png are allowed';
        this.form.controls[this.controlName].setValue('');
        return this.defaultImage = 'assets/images/avatar/user-profile.png';
      } else {
        reader.onload = (file: any) => {
          this.uploadedImage = self.sanitizer.bypassSecurityTrustResourceUrl(file.target.result);
          this.form.controls[this.controlName].setValue(file.target.result);
          this.defaultImage = '';
          this.imageFileError = false;
          this.imageErrorMsg = '';
          this.cd.detectChanges();
        };
      }
    }
  }

  notifyChange() {
    if (!this.imageFileError && this.form && this.controlName && this.form.controls[this.controlName].value) {
      this.valueChange.emit({ key: this.controlName, value: this.form.controls[this.controlName].value });
    }
  }

  displayImage(value) {
    if (!value) {
      return this.defaultImage;
    } else {
      return value;
    }
  }
}
