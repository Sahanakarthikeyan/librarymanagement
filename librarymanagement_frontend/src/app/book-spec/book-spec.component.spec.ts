import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSpecComponent } from './book-spec.component';

describe('BookSpecComponent', () => {
  let component: BookSpecComponent;
  let fixture: ComponentFixture<BookSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSpecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
