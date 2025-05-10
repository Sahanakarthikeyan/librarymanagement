import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:3000/books';
  private apiUrl1 = 'http://localhost:3000/postbooks';
  private apiUrl2 = 'http://localhost:3000/deletebook';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getBookByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      catchError(this.handleError)
    );
  }
  getBookById(bookId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookId}`);
  }
  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl2}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  
  
  addBook(book: any): Observable<any> {
    return this.http.post<any>(this.apiUrl1, book).pipe(
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
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'Book not found';
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}