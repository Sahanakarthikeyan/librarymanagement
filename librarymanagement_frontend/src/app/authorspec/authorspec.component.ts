import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthorsService } from '../authors.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authorspec',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[AuthorsService],
  templateUrl: './authorspec.component.html',
  styleUrl: './authorspec.component.css'
})
export class AuthorspecComponent {
  author: any[] =[]; 
  error: string | null = null;
  authorName?: string | null = null;

  constructor(private route: ActivatedRoute, private authorService: AuthorsService) {}

  ngOnInit() {
    this.authorName = this.route.snapshot.paramMap.get('name');
    if (this.authorName) {
      this.authorService.getAuthorByName(this.authorName)
      .subscribe(data => {
        if (data) {
          this.author = data;
        }
      });
    }
  }


}