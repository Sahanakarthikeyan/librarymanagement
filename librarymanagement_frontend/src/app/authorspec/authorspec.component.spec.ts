import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorspecComponent } from './authorspec.component';

describe('AuthorspecComponent', () => {
  let component: AuthorspecComponent;
  let fixture: ComponentFixture<AuthorspecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorspecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorspecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
