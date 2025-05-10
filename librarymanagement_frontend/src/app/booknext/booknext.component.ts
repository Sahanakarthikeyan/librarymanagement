// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule, NgFor } from '@angular/common';
// import { BookService } from '../book.service';
// import { BooksComponent } from '../books/books.component';
// import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'booknext',
//   standalone: true,
//   imports: [FormsModule, NgFor, BooksComponent, RouterModule, RouterOutlet],
//   providers: [BookService],
//   templateUrl: './booknext.component.html',
//   styleUrls: ['./booknext.component.css']
// })
// export class BooknextComponent implements OnInit {

//   bookName: string = '';
//   author: string = '';
//   price: number = 0;
//   purchaseDate: string = ''; // Update purchaseDate to be a string
//   boughtFrom: string = '';
//   bookType: string = '';
//   identity: number = 0;
//   isEditMode: boolean = false;

//   books: any[] = []; // Array to store the list of books

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private bookService: BookService
//   ) {}

//   ngOnInit(): void {
//     const bookName = this.route.snapshot.paramMap.get('name');
//     if (bookName) {
//       this.isEditMode = true;
//       this.bookService.getBookByName(bookName).subscribe((book: any) => {
//         if (book) {
//           this.bookName = book.book_name;
//           this.author = book.Author;
//           this.price = book.Price;
//           this.purchaseDate = this.formatDate(new Date(book.Date_of_purchase));
//           this.boughtFrom = book.Bought_from;
//           this.bookType = book.book_type;
//           this.identity = book.Id;
//         }
//       });
//     } else {
//       this.purchaseDate = this.getCurrentDate(); 
//     }
//   }

//   getCurrentDate(): string {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const dd = String(today.getDate()).padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
//   }

//   formatDate(date: Date): string {
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const dd = String(date.getDate()).padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
//   }

//   onSubmit() {
//     const bookDetails = {
//       bookName: this.bookName,
//       author: this.author,
//       price: this.price,
//       purchaseDate: this.purchaseDate,
//       boughtFrom: this.boughtFrom,
//       bookType: this.bookType,
//       identity: this.identity
//     };
//     if (this.isEditMode) {
      
//       this.http.put<any>(`http://localhost:3000/books/${this.identity}`, bookDetails).subscribe({
//         next: () => {
//           this.router.navigate(['/books']);
//         },
//         error: (error) => {
//           console.error('Error editing book', error);
//         }
//       });
//     } else {
//       this.http.post<any>('http://localhost:3000/postbooks', bookDetails).subscribe({
//         next: () => {
//           this.router.navigate(['/books']);
//         },
//         error: (error) => {
//           console.error('Error adding book', error);
//         }
//       });
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { BookService } from '../book.service';
import { BooksComponent } from '../books/books.component';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { toDataURL } from 'qrcode';
interface ErrorResponse {
  error: string;
}
@Component({
  selector: 'booknext',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [BookService],
  templateUrl: './booknext.component.html',
  styleUrls: ['./booknext.component.css']
})
export class BooknextComponent implements OnInit {

  bookName: string = '';
  author: string = '';
  price: number = 0;
  purchaseDate: string = ''; // Update purchaseDate to be a string
  boughtFrom: string = '';
  bookType: string = '';
  identity: number = 0;
  genre: string = '';
  isbn:number=0;
  isEditMode: boolean = false;

  books: any[] = []; // Array to store the list of books

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookName = this.route.snapshot.paramMap.get('name');
    if (bookName) {
      this.isEditMode = true;
      this.bookService.getBookByName(bookName).subscribe((book: any) => {
        if (book) {
          this.bookName = book.book_name;
          this.author = book.author;
          this.price = book.price;
          this.purchaseDate = this.formatDate(new Date(book.date_of_purchase));
          this.boughtFrom = book.bought_from;
          this.bookType = book.book_type;
          this.identity = book.book_id;
          this.genre = book.genre;
          this.isbn = book.isbn;
        }
      });
    } else {
      this.purchaseDate = this.getCurrentDate(); 
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit() {
    const bookDetails = {
      bookName: this.bookName,
      author: this.author,
      price: this.price,
      purchaseDate: this.purchaseDate,
      boughtFrom: this.boughtFrom,
      bookType: this.bookType,
      identity: this.identity,
      genre: this.genre,
      isbn: this.isbn
    };

    toDataURL(JSON.stringify(bookDetails), (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }

      const bookWithQR = {
        ...bookDetails,
        qrCode: url
      };

      if (this.isEditMode) {
        this.http.put<any>(`http://localhost:3000/books/${this.identity}`, bookWithQR).subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          error: (error) => {
            console.error('Error editing book', error);
          }
        });
      } else {
        this.http.post<any>('http://localhost:3000/postbooks', bookWithQR).subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          
          error: (error) => {
            console.error('Error adding Book', error);
            if (error.status === 400 && (error.error as ErrorResponse).error === 'ID already used') {
              alert('ID already used');
            } else {
              alert('An error occurred. Please try again.');
            }
          }
        });
      }
    });
  }
}
