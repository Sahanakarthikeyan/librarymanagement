import { TestBed } from '@angular/core/testing';

import { ReturnedService } from './returned.service';

describe('ReturnedService', () => {
  let service: ReturnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
