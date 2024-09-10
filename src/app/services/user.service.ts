import { Injectable } from '@angular/core';
import { USER_TYPE, User } from '../models/user.model';
import { Observable, delay, map, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { API_ENDPOINT, SERVER, SERVER_TYPE } from '../core/utils/constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersList: User[];
  constructor(
    private router: Router,
    private readonly http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.usersList = this.localStorageService.getData('users');
  }

  private _mockLogin(userDetails: any): Observable<boolean> {
    const user = this.usersList.find(
      (item) =>
        item.email === userDetails.email &&
        item.password === userDetails.password &&
        item.userType === userDetails.userType
    );
    if (!user) {
      return of(false);
    } else {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(true);
    }
  }

  public login(userDetails: User) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.USER.USER_LIST}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockLogin(userDetails);
    }
    const request$ = this.http.get<boolean>(url).pipe(
      map((userList: boolean) => {
        return userList;
      })
    );
    return request$;
  }

  public logout() {
    this.localStorageService.removedata('currentUser');
    this.router.navigate(['/login']);
  }
  public getLogedInUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  private _mockUpdateUser(user: User): Observable<User> {
    const index = this.usersList.findIndex((item) => item.id === user.id);
    if (index !== -1) {
      this.usersList[index] = { ...this.usersList[index], ...user };
      return of(user);
    } else {
      return throwError(() => new Error('User not Found '));
    }
  }
  public updateUser(user: User) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.USER.USER_LIST}/${user.id}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockUpdateUser(user);
    }
    const request$ = this.http.put<User>(url, user).pipe(
      map((userList: User) => {
        return userList;
      })
    );
    return request$;
  }
  private _mockSignUp(user: User): Observable<User> {
    const index = this.usersList.findIndex((item) => item.email === user.email);

    if (index !== -1) {
      return throwError(
        () => new Error('User already exists with this email ')
      );
    } else {
      const id = this.usersList.length + 1;
      user.id = id;

      this.usersList.push(user);
      return of(user);
    }
  }

  public signUp(user: User) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.USER.LOGIN}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockSignUp(user);
    }
    const request$ = this.http.post<User>(url, user).pipe(
      map((user: User) => {
        return user;
      })
    );
    return request$;
  }

  private _mockGetUsersByEmails(emails: string[]): Observable<User[]> {
    const filteredUsers = this.usersList.filter((user) =>
      emails.includes(user.email)
    );
    if (filteredUsers.length === 0) {
      throw new Error('No users found for the given emails');
    }
    return of(filteredUsers);
  }

  public getUsersByEmails(emails: string[]) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.USER.USER_LIST}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockGetUsersByEmails(emails);
    }
    const request$ = this.http.post<User[]>(url, emails).pipe(
      map((user: User[]) => {
        return user;
      })
    );
    return request$;
  }
}
