import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextCustComponent } from './next-cust.component';

describe('NextCustComponent', () => {
  let component: NextCustComponent;
  let fixture: ComponentFixture<NextCustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextCustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
