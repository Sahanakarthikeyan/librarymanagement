import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustService {

  private apiUrl = 'http://localhost:3000/customers';
  private apiUrl2 = 'http://localhost:3000/deletecust';
  private apiUrl3 = 'http://localhost:3000/custName';


  constructor(private http: HttpClient) { }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getCustomerById(id: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  deleteCust(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl2}/${Id}`).pipe(
      catchError(this.handleError)
    );
  }
  getCustomerByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  fetchBookDetails(id: string): Observable<any>{
    
    return this.http.get<any>(`${this.apiUrl3}/${id}`).pipe(
      catchError(this.handleError)
    )
  
 
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