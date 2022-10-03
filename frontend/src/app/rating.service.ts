import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getRatingsByBookId(data) {
    return this.http.post(`${this.uri}/rating/getRatingsByBookId`, data);
  }

  insertRating(data) {
    return this.http.post(`${this.uri}/rating/insertRating`, data);
  }

  
  getNumberOfRatingsForBook(data) {
    return this.http.post(`${this.uri}/rating/getNumberOfRatingsForBook`, data);
  }
}
