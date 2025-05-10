import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LentService {

  private apiUrl = 'http://localhost:3000/lent';

  constructor(private http: HttpClient) { }

  getLent(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }}