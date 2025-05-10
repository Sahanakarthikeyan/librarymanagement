import { AuthorsComponent } from './authors/authors.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { AppComponent } from './app.component';
import { BookSpecComponent } from './book-spec/book-spec.component';
import { HomeComponent } from './home/home.component';
import { CustComponent } from './cust/cust.component';
import { CustspecComponent } from './custspec/custspec.component';
import { AuthorspecComponent } from './authorspec/authorspec.component';
import { LentComponent } from './lent/lent.component';
import { ReturnedComponent } from './returned/returned.component';
import { BooknextComponent } from './booknext/booknext.component';
import { NextCustComponent } from './next-cust/next-cust.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [

    {path:'books',component:BooksComponent},
    {path: 'books/:name', component: BookSpecComponent },
    {path : '', component : HomeComponent},
    {path : 'customers', component:CustComponent},
    { path: 'customers/:id', component: CustspecComponent },
    {path : 'authors', component:AuthorsComponent},
    {path : 'authors/:name', component:AuthorspecComponent},
    {path : 'lent', component:LentComponent},
    {path : 'returned', component:ReturnedComponent},
    {path : 'booknext', component:BooknextComponent},
    {path : 'custnext', component:NextCustComponent},
    {path: 'booknext/:name', component: BooknextComponent }, 
    {path: 'bookspec/:name', component: BookSpecComponent },
    {path: 'custnext/:id', component: NextCustComponent }, 
    {path: 'custspec/:name', component: BookSpecComponent },
    // {path: 'bookspec', component: BookSpecComponent },
    { path: 'report', component: ReportComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }