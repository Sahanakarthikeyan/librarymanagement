// import { CustComponent } from './../cust/cust.component';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Component } from '@angular/core';
// import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { BookService } from '../book.service';
// import { CustService } from '../cust.service';
// import { NgIf } from '@angular/common';

// interface ErrorResponse {
//   error: string;
// }

// interface SuccessResponse {
//   message: string;
// }

// @Component({
//   selector: 'app-next-cust',
//   standalone: true,
//   imports: [NgIf, FormsModule, CustComponent, RouterModule, RouterOutlet],
//   templateUrl: './next-cust.component.html',
//   styleUrls: ['./next-cust.component.css']
// })
// export class NextCustComponent {
//   Fname: string = '';
//   Lname: string = '';
//   Mobile: number = 0;
//   Email = '';
//   // Address: string = '';
//   Street: string = '';
//   City: string = '';
//   Id: number = 0;
//   joinDate: String ='';
//   isEditMode: boolean = false;

//   constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private custService: CustService) {}

//   ngOnInit(): void {
//     const custId = this.route.snapshot.paramMap.get('id');
//     if (custId) {
//       this.isEditMode = true;
//       this.custService.getCustomerById(custId).subscribe((cust: any) => {
//         if (cust) {
//           this.Fname = cust.cust_fname;
//           this.Lname = cust.cust_lname;
//           this.Mobile = cust.Mobile;
//           this.Email = cust.email;
//           // this.Address = cust.address;
//           this.Street = cust.address[0];
//           this.City = cust.address[1];
//           this.Id = cust.cust_id;
//           this.joinDate=cust.join_Date;
//         }
//       });
//     }else{
//       this.joinDate = this.getCurrentDate(); 
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
//     const custDetails = {
//       Fname: this.Fname,
//       Lname: this.Lname,
//       Mobile: this.Mobile,
//       Email: this.Email,
//       // Address: this.Address,
//       Street: this.Street,
//       City: this.City,
//       Id: this.Id,
//       joinDate: this.joinDate
//     };

//     if (this.isEditMode) {
//       this.http.put<any>(`http://localhost:3000/cust/${this.Id}`, custDetails).subscribe({
//         next: () => {
//           this.router.navigate(['/customers']);
//         },
//         error: (error) => {
//           console.error('Error editing Customer', error);
//           alert('An error occurred while editing the customer. Please try again.');
//         }
//       });
//     } else {
//       this.http.post<any>('http://localhost:3000/postcust', custDetails).subscribe({
//         next: (response) => {
//           this.router.navigate(['/customers']);
//         },
//         error: (error) => {
//           console.error('Error adding Customer', error);
//           if (error.status === 400 && (error.error as ErrorResponse).error === 'ID already used') {
//             alert('ID already used');
//           } else {
//             alert('An error occurred. Please try again.');
//           }
//         }
//       });
//     }
//   }
// }




import { CustComponent } from './../cust/cust.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CustService } from '../cust.service';
import { NgIf } from '@angular/common';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

@Component({
  selector: 'app-next-cust',
  standalone: true,
  imports: [NgIf, FormsModule, RouterModule],
  templateUrl: './next-cust.component.html',
  styleUrls: ['./next-cust.component.css']
})
export class NextCustComponent {
  Fname: string = '';
  Lname: string = '';
  Mobile: number = 0;
  Email = '';
  Street: string = '';
  City: string = '';
  Id: number = 0;
  joinDate: string = '';
  isEditMode: boolean = false;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private custService: CustService) {}

  ngOnInit(): void {
    const custId = this.route.snapshot.paramMap.get('id');
    if (custId) {
      this.isEditMode = true;
      this.custService.getCustomerById(custId).subscribe((cust: any) => {
        if (cust) {
          this.Fname = cust.cust_fname;
          this.Lname = cust.cust_lname;
          this.Mobile = cust.mobile;
          this.Email = cust.email;
          this.Street = cust.address[0];
          this.City = cust.address[1];
          this.Id = cust.cust_id;
          this.joinDate = this.formatDateWithoutTime(new Date(cust.join_date));
        }
      });
    } else {
      this.joinDate = this.getCurrentDate(); 
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  }

  formatDateWithoutTime(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit() {
    const custDetails = {
      Fname: this.Fname,
      Lname: this.Lname,
      Mobile: this.Mobile,
      Email: this.Email,
      Street: this.Street,
      City: this.City,
      Id: this.Id,
      joinDate: this.joinDate
    };

    if (this.isEditMode) {
      this.http.put<any>(`http://localhost:3000/cust/${this.Id}`, custDetails).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error editing Customer', error);
          alert('An error occurred while editing the customer. Please try again.');
        }
      });
    } else {
      this.http.post<any>('http://localhost:3000/postcust', custDetails).subscribe({
        next: (response) => {
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error adding Customer', error);
          if (error.status === 400 && (error.error as ErrorResponse).error === 'ID already used') {
            alert('ID already used');
          } else {
            alert('An error occurred. Please try again.');
          }
        }
      });
    }
  }
}
