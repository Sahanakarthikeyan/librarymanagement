import { Router, RouterModule } from '@angular/router';
import { AuthorsService } from './../authors.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers:[AuthorsService],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent implements OnInit{
  author: any[] = [];

  constructor(private authorService: AuthorsService,private router : Router) 
  { 
    
  }  
  ngOnInit() {
    this.authorService.getAuthors().subscribe(data => {
      this.author = data;
    });
  }

}