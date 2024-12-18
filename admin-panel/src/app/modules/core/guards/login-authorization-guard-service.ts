import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonFunction } from '../common/common-function';

@Injectable({
    providedIn: 'root',
})
export class LoginAuthorizationGuardService implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        public commonFunction: CommonFunction
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.checkIfAuthorized(route, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkIfAuthorized(childRoute, state);
    }

    checkIfAuthorized(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.authenticationService.isAuthorized().pipe(map((isAuthorized: any) => {
            if (isAuthorized.isLoggedIn) {
                this.router.navigate(['/blogs']);
                return false;
            }
            return true;
        }));
    }

}
