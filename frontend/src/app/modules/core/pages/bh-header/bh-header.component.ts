import { Component, OnInit } from '@angular/core';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { CommonFunction } from '../../common/common-function';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bh-header',
  templateUrl: './bh-header.component.html',
  styleUrls: ['./bh-header.component.scss']
})
export class BhHeaderComponent implements OnInit {

  closeResult = '';

  constructor(
    public commonFunction: CommonFunction,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  navigateToSignIn() {
    this.activeModal.close();
    this.commonFunction.openSignInComponent();
  }

}
