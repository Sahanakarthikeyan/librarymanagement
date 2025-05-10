import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnedService {

  private apiUrl = 'http://localhost:3000/return';

  constructor(private http: HttpClient) { }

  getReturned(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }}