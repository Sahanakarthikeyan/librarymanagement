import { LentComponent } from './../lent/lent.component';
import { AuthorsComponent } from './../authors/authors.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BookSpecComponent } from '../book-spec/book-spec.component';
import { BooksComponent } from '../books/books.component';
import { CustComponent } from '../cust/cust.component';
import { CustspecComponent } from '../custspec/custspec.component';
import { BooknextComponent } from '../booknext/booknext.component';
import { AuthorspecComponent } from '../authorspec/authorspec.component';
import { NextCustComponent } from '../next-cust/next-cust.component';
import { ReturnedComponent } from '../returned/returned.component';
import { AppRoutingModule } from '../app.routes';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule,
    RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
navToReturnedPage() {
throw new Error('Method not implemented.');
}
navToLentPage() : void {
  this.router.navigate(['/lent']);

}
  constructor(private router: Router) {}

  navToBookPage(): void {
    this.router.navigate(['/books']);
  }
  navToCustPage() : void
  {
    this.router.navigate(['/customers']);
  }
  navToAuthorPage() : void
  {
    this.router.navigate(['/authors']);
  }
  navToReportPage(): void 
  {
    this.router.navigate(['/report']);
  }  

}