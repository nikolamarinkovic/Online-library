import { TestBed } from '@angular/core/testing';

import { RentHistoryService } from './rent-history.service';

describe('RentHistoryService', () => {
  let service: RentHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
