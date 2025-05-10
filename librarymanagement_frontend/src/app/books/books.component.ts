
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../book.service';
import { HomeComponent } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { BooknextComponent } from '../booknext/booknext.component';
import {   Observable,of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import * as QRCode from 'qrcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'books',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books$: Observable<any[]> = of([]);
  selectedQRCode: SafeUrl | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.books$ = this.bookService.getBooks().pipe(
      tap(data => {
        console.log('Books data:', data); // Debugging purpose
      })
    );
  }

  // Method to generate QR code for a given book
  generateQRCode(bookName: string): void {
    const currentDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(currentDate.getDate() + 14);

    this.bookService.getBookByName(bookName).subscribe(book => {
      const bookData = {
        book_name: book.book_name,
        author: book.author,
        price: book.price,
        date_of_purchase: book.date_of_purchase,
        bought_from: book.bought_from,
        current_status: book.current_status,
        book_type: book.book_type,
        book_id: book.book_id,
        indicator: book.indicator,
        date_Of_Lending: formatDate(currentDate, 'yyyy-MM-dd', 'en'),
        return_Date: formatDate(returnDate, 'yyyy-MM-dd', 'en'),
        last_borrower: book.last_borrower
      };

      const bookDataString = JSON.stringify(bookData);

      QRCode.toDataURL(bookDataString, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        this.selectedQRCode = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    });
  }
  // Method to delete a book
  DeleteBook(id: number, indicator: string, type: string) {
    if (window.confirm("Do you want to delete this Book?")) {
      if (indicator === 'green') {
        if (type === 'Physical'){
        this.bookService.deleteBook(id).subscribe({
          next: (response) => {
            location.reload(); 
          },
          error: (error) => {
            console.error('Error deleting book', error);
          }
        });
      } else {
        alert("E Book Can't be Deleted");
      }
     } else {
      alert("Lent Book Can't be Deleted");
    }
    }
  }

  

  closeQRCode() {
    this.selectedQRCode = null;
  }
}
