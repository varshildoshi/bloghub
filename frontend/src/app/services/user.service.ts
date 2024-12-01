import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authService: AuthenticationService,
    private afs: AngularFirestore
  ) { }

  getProfileData(currentUserId) {
    return this.afs.doc(`users/${currentUserId}`).valueChanges();
  }

  // addUser(user): Observable<any> {
  //   // const ref = this.afs.collection('users').add(user);
  //   // return ref;
  //   // const ref = doc(this.afs, 'users', user.uid);
  //   // return from(setDoc(ref, user));
  // }

  // updateUser(user): Observable<void> {
  //   const ref = doc(this.afs, 'users', user.uid);
  //   return from(updateDoc(ref, { ...user }));
  // }
}
