import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getTop3Books() {
    return this.http.get(`${this.uri}/book/getTop3Books`);
  }

  acceptBook(data) {
    return this.http.post(`${this.uri}/book/acceptBook`, data);
  }

  updateBookInfo(formData) {
    return this.http.post(`${this.uri}/book/updateBookInfo`, formData);
  }

  getRentedBooksByUser(data) {
    return this.http.post(`${this.uri}/book/getRentedBooksByUser`, data);
  }

  insertBook(formData) {
    return this.http.post(`${this.uri}/book/insertBook`, formData);
  }

  getAllBooks() {
    return this.http.get(`${this.uri}/book/getAllBooks`);
  }

  getAllPendingBooks() {
    return this.http.get(`${this.uri}/book/getAllPendingBooks`);
  }

  getAllAcceptedBooks() {
    return this.http.get(`${this.uri}/book/getAllAcceptedBooks`);
  }

  getAllAcceptedBooksSuggestedByUser(data) {
    return this.http.post(
      `${this.uri}/book/getAllAcceptedBooksSuggestedByUser`,
      data
    );
  }

  getBookPhoto(data) {
    return this.http.post(`${this.uri}/book/getPhoto`, data, {
      responseType: 'blob',
    });
  }

  searchAcceptedBooksByParam(data) {
    return this.http.post(`${this.uri}/book/searchAcceptedBooksByParam`, data);
  }

  getBookOfTheDay() {
    return this.http.get(`${this.uri}/book/getBookOfTheDay`);
  }

  getBooksByIdsRepeat(data) {
    return this.http.post(`${this.uri}/book/getBooksByIdsRepeat`, data);
  }

  getBooksByIds(data) {
    return this.http.post(`${this.uri}/book/getBooksByIds`, data);
  }

  takeBook(data) {
    return this.http.post(`${this.uri}/book/takeBook`, data);
  }

  reserveBook(data) {
    return this.http.post(`${this.uri}/book/reserveBook`, data);
  }

  deleteBook(data) {
    return this.http.post(`${this.uri}/book/deleteBook`, data);
  }

  setBookOfTheDay(data) {
    return this.http.post(`${this.uri}/book/setBookOfTheDay`, data);
  }

  changeBookInfo(data) {
    return this.http.post(`${this.uri}/book/changeBookInfo`, data);
  }

  denyBook(data){
    return this.http.post(`${this.uri}/book/denyBook`, data);
  }
}
