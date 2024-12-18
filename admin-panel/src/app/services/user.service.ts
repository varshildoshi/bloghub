import { EventEmitter, Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject, filter, from, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient,
    public authService: AuthenticationService
  ) { }

  getUserProfile(id) {
    return this.http.get(`${environment.baseURL}users/profile/${id}`);
  }

  updateUser(payload): Observable<any> {
    return this.http.put(environment.baseURL + `users/${payload.id}`, payload).pipe(
      tap(n => this.authService.saveAccessData(n))
    );
  }

  uploadProfile(formData: FormData): Observable<any> {
    return this.http.post<FormData>(environment.baseURL + 'users/upload', formData).pipe(
      tap(n => this.authService.saveAccessData(n))
    );
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
