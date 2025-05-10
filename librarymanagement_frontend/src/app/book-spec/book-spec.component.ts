import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../book.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'bookspec',
  standalone: true,
  imports: [CommonModule,RouterModule],
  providers:[BookService],
  templateUrl: './book-spec.component.html',
  styleUrls: ['./book-spec.component.css']
})
export class BookSpecComponent implements OnInit{
  book: any; 
  error: string | null = null;

  constructor(private route: ActivatedRoute, private bookService: BookService,private router:Router) {}

  ngOnInit() {
    const bookName = this.route.snapshot.paramMap.get('name');
    if (bookName) {
      this.bookService.getBookByName(bookName)
      .subscribe(data => {
        if (data) {
          this.book = data;
        }
      });
    }
  }

  editBook(bookname: string) :void {
    this.router.navigate(['/booknext', bookname]);
  }


}