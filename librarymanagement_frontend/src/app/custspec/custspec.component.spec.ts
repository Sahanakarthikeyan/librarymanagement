import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustspecComponent } from './custspec.component';

describe('CustspecComponent', () => {
  let component: CustspecComponent;
  let fixture: ComponentFixture<CustspecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustspecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustspecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
