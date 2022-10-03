import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RentHistoryService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  addBookToHistory(data) {
    return this.http.post(`${this.uri}/rentHistory/addBookToHistory`, data);
  }

  getUserRentHistory(data) {
    return this.http.post(`${this.uri}/rentHistory/getUserRentHistory`, data);
  }
}
