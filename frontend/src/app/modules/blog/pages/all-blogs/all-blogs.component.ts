import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';

// import firebase from 'firebase/compat/app';
// import { getAuth, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.scss']
})
export class AllBlogsComponent implements OnInit {

  currentUser;

  constructor(
    private authService: AuthenticationService,
    private activeModalBox: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    // this.authService.autoLogin();
    // this.authService.isLoggedIn();
    // this.authService.user.subscribe(x => {
    //   this.currentUser = x;
    // })
  }
}
