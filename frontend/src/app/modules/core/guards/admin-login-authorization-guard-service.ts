import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../../state/auth/services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AdminLoginAuthorizationGuardService implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.checkIfAuthorized(route, state);
    }

    checkIfAuthorized(route: ActivatedRouteSnapshot,
                      state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.authenticationService.isAuthorizedAdmin().pipe(map(isAuthorized => {
            if (isAuthorized) {
                this.router.navigate(['admin/dashboard']);
                return false;
            }
            return true;
        }));
    }

}
