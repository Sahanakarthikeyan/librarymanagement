import { TestBed } from '@angular/core/testing';

import { CustService } from './cust.service';

describe('CustService', () => {
  let service: CustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
