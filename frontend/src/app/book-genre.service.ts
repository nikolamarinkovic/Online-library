import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookGenreService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getAllGenres() {
    return this.http.get(`${this.uri}/genre/getAllGenres`);
  }

}
