import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private apiUrl = 'http://localhost:3000/authors';

  constructor(private http: HttpClient) { }

  getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getAuthorByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `erver returned code: ${error.status}, error message is: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'Book not found';
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


}