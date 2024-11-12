import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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

  constructor(
    private authService: AuthenticationService,
    private activeModalBox: NgbActiveModal,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.authService.user$.subscribe(res => {
    //   console.log(res);
    // });
  }

  logout() {
    this.authService.Logout();
  }

}
