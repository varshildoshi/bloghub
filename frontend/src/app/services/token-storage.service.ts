import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TokenStorage {

  /**
   * Set User info
   * @returns Observable<string>
   */
  public setUserInfo(userInfo) {
    localStorage.setItem(btoa('userInfo'), JSON.stringify(userInfo));
    return this;
  }

  /**
   * Get User info
   * @returns Observable<string>
   */
  public getUserInfo() {
    return localStorage.getItem(btoa('userInfo')) &&
      JSON.parse(localStorage.getItem(btoa('userInfo')));
  }

  /**
   * Get access token
   * @returns Observable<string>
   */
  public getAccessToken(): string {
    const token: string = localStorage.getItem(btoa('accessToken'));
    return token;
  }

  /**
   * Get refresh token
   * @returns Observable<string>
   */
  public getRefreshToken(): Observable<string> {
    const token: string = localStorage.getItem(btoa('refreshToken'));
    // console.log('getRefreshToken::', token);
    return of(token);
  }

  /**
   * Get user roles in JSON string
   * @returns Observable<any>
   */
  public getUserRoles(): Observable<any> {
    const roles: any = localStorage.getItem(btoa('userRoles'));
    try {
      // console.log('roles::', roles);
      return of(JSON.parse(roles));
    } catch (e) { }
  }

  /**
   * Get User Id
   * @returns Observable<string>
   */
  public getUserID(): string {
    const userId: string = localStorage.getItem(btoa('userId'));
    return userId;
  }

  /**
   * Get User Id
   * @returns Observable<string>
   */
  public getPlanStatus(): string {
    const status: string = localStorage.getItem(btoa('planStatus'));
    return status;
  }

  /**
   * Get User Id
   * @returns Observable<string>
   */
  public getIsAdmin(): boolean {
    const isAdmin: string = localStorage.getItem(btoa('isAdmin'));
    return isAdmin && isAdmin !== 'null' && isAdmin !== 'false';
  }

  /**
   * Get User Id
   * @returns Observable<string>
   */
  public getAdminUserID(): string {
    const userId: string = localStorage.getItem(btoa('userId'));
    return userId;
  }


  /**
   * Get Organization Id
   * @returns Observable<string>
   */
  public getOrganizationID(): string {
    const organizationId: string = localStorage.getItem(btoa('organizationId'));
    return organizationId;
  }

  /**
   * Get User Id
   * @returns Observable<string>
   */
  public getAccountID(): string {
    const accountId: string = localStorage.getItem(btoa('accountId'));
    return accountId;
  }

  public getHeaderAccessToken() {
    const token: string = localStorage.getItem(btoa('accessToken'));
    return token;
  }


  public getHeaderAdminAccessToken() {
    const token: string = localStorage.getItem(btoa('adminAccessToken'));
    return token;
  }

  /**
   * Set organization id
   * @returns TokenStorage
   */
  public setOrganizationID(organizationID: string): TokenStorage {
    localStorage.setItem(btoa('organizationID'), organizationID);
    return this;
  }

  public setUserOrganizationRoleID(userOrganizationRoleID: string): TokenStorage {
    localStorage.setItem(btoa('userOrganizationRoleID'), userOrganizationRoleID);
    return this;
  }


  /**
   * SET User Id
   * @returns Observable<string>
   */
  public setIsAdmin(isAdmin: string): TokenStorage {
    localStorage.setItem(btoa('isAdmin'), isAdmin);
    return this;
  }


  /**
   * Set admin access token
   * @returns TokenStorage
   */
  public setAdminAccessToken(token: string): TokenStorage {
    localStorage.setItem(btoa('adminAccessToken'), token);
    return this;
  }


  /**
   * Set access token
   * @returns TokenStorage
   */
  public setAccessToken(token: string): TokenStorage {
    localStorage.setItem(btoa('accessToken'), token);
    return this;
  }

  /**
   * Set refresh token
   * @returns TokenStorage
   */
  public setRefreshToken(token: string): TokenStorage {
    localStorage.setItem(btoa('refreshToken'), token);
    return this;
  }

  /**
   * Set user roles
   * @param roles: roles
   * @returns TokenStorage
   */
  public setUserRoles(roles: any): any {
    if (roles != null) {
      localStorage.setItem(btoa('userRoles'), JSON.stringify(roles));
    }
    return this;
  }

  /**
   * Set userId
   * @returns TokenStorage
   */
  public setUserID(userId: string): TokenStorage {
    localStorage.setItem(btoa('userId'), userId);
    return this;
  }

  /**
   * Set plan Status
   * @returns TokenStorage
   */
  public setPlanStatus(payment: string): TokenStorage {
    localStorage.setItem(btoa('planStatus'), payment);
    return this;
  }


  /**
   * Set userId
   * @returns TokenStorage
   */
  public setAdminUserID(userId: string): TokenStorage {
    localStorage.setItem(btoa('userId'), userId);
    return this;
  }


  /**
   * Set accountId
   * @returns TokenStorage
   */
  public setAccountID(accountId: string): TokenStorage {
    localStorage.setItem(btoa('accountId'), accountId);
    return this;
  }

  /**
   * Remove tokens
   */
  public clear() {
    localStorage.clear();
  }
}
