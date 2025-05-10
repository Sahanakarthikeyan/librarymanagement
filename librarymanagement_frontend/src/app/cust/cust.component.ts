import { CustService } from './../cust.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cust',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[CustService],
  templateUrl: './cust.component.html',
  styleUrls: ['./cust.component.css']
})
export class CustComponent implements OnInit{
  cust:any[]=[];

  constructor(private custService:CustService,private router:Router){}
  ngOnInit() {
    this.custService.getCustomers().subscribe(data => {
      this.cust = data;
    });
  }
  emptyObject: any=
  {
    book_name: null,
    author: null,
    price: null,
    date_of_purchase: null,
    bought_from: null,
    current_status: null,
    book_type: null,
    book_id: null,
    indicator: null,
    date_Of_lending: null,
    return_date: null,
    last_borrower: null,
    cust_id: null
  }

  checkAndDelete(custId: string): void {
    this.custService.fetchBookDetails(custId)
      
      .subscribe(data => {
        if (data != null) {
          this.DeleteCust(Number(custId));
        } else {
          window.confirm("This customer can't be deleted. The customer has lent some books.");
        }
      });
  }
DeleteCust(custId:number) {
  
  if(window.confirm("Do you want to delete this Customer?"))
  {
    this.custService.deleteCust(custId).subscribe({
      next: (response) => {
        location.reload(); 
      },
      error: (error) => {
        console.error('Error deleting Customer', error);
      }
    });
  }
}
}