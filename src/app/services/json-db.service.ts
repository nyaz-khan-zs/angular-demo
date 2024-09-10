import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JsonDbService {
  constructor(private http: HttpClient) {}

  loadJson(filePath: string): Observable<any[]> {
    return this.http.get<any[]>(filePath).pipe(
      map((data) => {
        return data;
      }),
      catchError((error) => {
        console.error('Error loading JSON file:', error);
        return of([]);
      })
    );
  }
}
