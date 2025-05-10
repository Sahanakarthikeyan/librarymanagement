import { TestBed } from '@angular/core/testing';

import { LentService } from './lent.service';

describe('LentService', () => {
  let service: LentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
