// Angular
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// RXJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Services
import { AuthenticationService } from '../../../state/auth/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthorizationGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkIfAuthorized(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkIfAuthorized(childRoute, state);
  }

  checkIfAuthorized(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authenticationService.isAuthorizedAdmin().pipe(map(isAuthorized => {
      if (isAuthorized) {
        return true;
      }
      this.router.navigate(['/admin/login']);
      return false;
    }));
  }

}
