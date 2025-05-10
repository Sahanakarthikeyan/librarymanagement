import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LentService } from '../lent.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-lent',
  standalone: true,
  imports: [CommonModule,RouterModule],
  providers:[LentService],
  templateUrl: './lent.component.html',
  styleUrl: './lent.component.css'
})
export class LentComponent implements OnInit{
  lent:any[]=[];
  constructor(private lentService:LentService,private router:Router){}
  ngOnInit() {
    this.lentService.getLent().subscribe(data => {
      this.lent = data;
    });
  }
  

}