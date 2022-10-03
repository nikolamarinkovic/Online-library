import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RentLengthService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:4000';

  getRentLength() {
    return this.http.get(`${this.uri}/rentLength/getRentLength`);
  }

  setRentLength(data) {
    return this.http.post(`${this.uri}/rentLength/setRentLength`, data);
  }
}
