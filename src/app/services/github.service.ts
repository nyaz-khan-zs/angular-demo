import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { GITHUB } from '../core/utils/constant';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  constructor(private http: HttpClient) {}

  checkUsername(username: string): Observable<boolean> {
    return this.http.get(`${GITHUB.BASE_URL}/${username}`).pipe(
      map((res) => {
        return true;
      }),
      catchError(() => of(false))
    );
  }
  getUserRepos(username: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${GITHUB.BASE_URL}/${username}/${GITHUB.REPOS}`
    );
  }
}
