import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooknextComponent } from './booknext.component';

describe('BooknextComponent', () => {
  let component: BooknextComponent;
  let fixture: ComponentFixture<BooknextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooknextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooknextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
