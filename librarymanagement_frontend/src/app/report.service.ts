import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  getCustomerIds() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/api/report'; // Ensure the correct API endpoint
  
  constructor(private http: HttpClient) {}

  getReport(
    bookId?: string,
    custId?: string,
    status?: string,
    notificationType?: string,
    transactionStatus?: string
  ): Observable<any[]> {
    let params = new HttpParams();

    if (bookId) {
      params = params.set('book_id', bookId);
    }
    if (custId) {
      params = params.set('cust_id', custId);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (notificationType) {
      params = params.set('notification_type', notificationType);
    }
    if (transactionStatus) {
      params = params.set('transaction_status', transactionStatus);
    }
    

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching report:', error);
        throw error; // Handle errors gracefully
      })
    );
  }

  getDistinctCustomerIds(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-customer-ids')
      .pipe(
        catchError((error) => {
          console.error('Error fetching customer IDs:', error);
          throw error;
        })
      );
  }
  getDistinctBookIds(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-book-ids')
      .pipe(
        catchError((error) => {
          console.error('Error fetching book IDs:', error);
          throw error;
        })
      );
  }
  //---------------------------------------------
  getDistinctmessages(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-messages')
      .pipe(
        catchError((error) => {
          console.error('Error fetching messages:', error);
          throw error;
        })
      );
  }

  getDistinctndate(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-notification-date')
      .pipe(
        catchError((error) => {
          console.error('Error fetching notification dates', error);
          throw error;
        })
      );
  }

  getDistinctlink(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-link')
      .pipe(
        catchError((error) => {
          console.error('Error fetching links', error);
          throw error;
        })
      );
  }

  getDistinctTransactionIds(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-transaction-ids')
      .pipe(
        catchError((error) => {
          console.error('Error fetching transaction ids', error);
          throw error;
        })
      );
  }
  getDistinctldate(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-lending-date')
      .pipe(
        catchError((error) => {
          console.error('Error fetching lending dates', error);
          throw error;
        })
      );
  }
  getDistinctdue(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/distinct-due')
      .pipe(
        catchError((error) => {
          console.error('Error fetching due amounts', error);
          throw error;
        })
      );
  }

  
  // ---------------------------------------------------
  getDistinctNotificationStatus(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/distinct-notification-status')
      .pipe(
        catchError((error) => {
          console.error('Error fetching notification statuses:', error);
          throw error;
        })
      );
  }

  getDistinctNotificationType(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/distinct-notification-type')
      .pipe(
        catchError((error) => {
          console.error('Error fetching notification types:', error);
          throw error;
        })
      );
  }

  getDistinctTransactionStatus(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/distinct-transaction-status')
      .pipe(
        catchError((error) => {
          console.error('Error fetching transaction statuses:', error);
          throw error;
        })
      );
  }

  getTotalCounts(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/total-counts');
  }  

  getNotificationsAndTransactions(sortField: string = 'transaction_id', sortOrder: string = 'asc') {
    return this.http.get<any[]>(`http://localhost:3000/api/sorted-transactions`, {
      params: { sortBy: sortField, order: sortOrder }
    });
  }
  getFilteredReports(filters: any): Observable<any> {
    const params = new URLSearchParams();
    if (filters.custId) params.append('custId', filters.custId);
    if (filters.status) params.append('status', filters.status);
    if (filters.notificationType) params.append('notificationType', filters.notificationType);
    if (filters.transactionStatus) params.append('transactionStatus', filters.transactionStatus);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    return this.http.get(`${this.apiUrl}/reports?${params.toString()}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(() => new Error('Something went wrong; please try again.'));
  }
  
  getReportData(maxRows: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/getReportData?maxRows=${maxRows}`);
  }

  getColumnValues(): Observable<any> {
    return this.http.get('http://localhost:3000/api/get-column-values');
  }

}


