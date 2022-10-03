import { TestBed } from '@angular/core/testing';

import { RentLengthService } from './rent-length.service';

describe('RentLengthService', () => {
  let service: RentLengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentLengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
