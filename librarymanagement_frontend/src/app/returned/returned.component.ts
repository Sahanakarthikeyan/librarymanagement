import { Component } from '@angular/core';
import { ReturnedService } from '../returned.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-returned',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './returned.component.html',
  styleUrl: './returned.component.css'
})
export class ReturnedComponent {
  returned:any[]=[];
  constructor(private returnedService:ReturnedService,private router:Router){}
  ngOnInit() {
    this.returnedService.getReturned().subscribe(data => {
      this.returned = data;
    });

}}