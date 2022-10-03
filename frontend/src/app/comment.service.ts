import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getCommentsForBook(data) {
    return this.http.post(`${this.uri}/comment/getCommentsForBook`, data);
  }

  insertComment(data) {
    return this.http.post(`${this.uri}/comment/insertComment`, data);
  }

  changeComment(data) {
    return this.http.post(`${this.uri}/comment/changeComment`, data);
  }
}
