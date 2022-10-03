import { TestBed } from '@angular/core/testing';

import { BookGenreService } from './book-genre.service';

describe('BookGenreService', () => {
  let service: BookGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
