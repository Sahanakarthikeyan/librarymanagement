import { BookService } from './../book.service';
import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CustService } from '../cust.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'custspec',
  standalone: true,
  imports: [CommonModule,RouterModule,NgIf],
  providers:[CustService],
  templateUrl: './custspec.component.html',
  styleUrl: './custspec.component.css'
})
export class CustspecComponent {
  cust:any;
  bookName: any;
  error: string | null = null;
  bookDeet: any;
  id: number = 0;
  custid: any;
  showCust: boolean = false;

  constructor(private route: ActivatedRoute, private custService: CustService,private bookService: BookService,private router:Router) {
   
  }

  ngOnInit() :void {
    const identity = this.route.snapshot.paramMap.get('id');
    this.custid = this.route.snapshot.paramMap.get('id');
    if (identity) {
      this.custService.getCustomerById(identity)
      .subscribe(data => {
        if (data) {
          this.cust = data;
        }
      });
      
    }
  }
  fetchBookButton(){
  this.showCust=!this.showCust;
  this.custService.fetchBookDetails(this.custid)
      .subscribe(data => {
        if (data) {
          this.bookDeet = data;
        }
      }
      );
    }
  
    
  navToBackPage():any
  {
    this.router.navigate(['/customers']);
  }
  editCust(id: number) :void {
    this.router.navigate(['/custnext', id]);
  }


}