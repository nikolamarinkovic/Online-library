import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  extendBookReturnDeadline(data) {
    return this.http.post(`${this.uri}/user/extendBookReturnDeadline`, data);
  }

  clearReservedBooksAvailable(data) {
    return this.http.post(`${this.uri}/user/clearReservedBooksAvailable`, data);
  }

  getUsernameById(data) {
    return this.http.post(`${this.uri}/user/getUsernameById`, data);
  }

  getUserById(data){
    return this.http.post(`${this.uri}/user/getUserById`, data);
  }

  returnBook(data) {
    return this.http.post(`${this.uri}/user/returnBook`, data);
  }

  changeUserInfo(formData) {
    return this.http.post(`${this.uri}/user/updateUserInfo`, formData);
  }

  addOrder(data) {
    return this.http.post(`${this.uri}/user/addOrder`, data);
  }

  addCompanyInfo(data) {
    return this.http.post(`${this.uri}/user/addCompanyInfo`, data);
  }

  getAllUsers() {
    return this.http.get(`${this.uri}/user/getAllUsers`);
  }

  login(data) {
    return this.http.post(`${this.uri}/user/login`, data);
  }

  register(formData) {
    return this.http.post(`${this.uri}/user/register`, formData);
  }

  getPhoto(data){
    return this.http.post(`${this.uri}/user/getPhoto`, data, {responseType : 'blob'});
  }

  getUserReservations(formData) {
    return this.http.post(`${this.uri}/user/getUserReservations`, formData);
  }

  upgradeReaderToModerator(data){
    return this.http.post(`${this.uri}/user/upgradeReaderToModerator`, data);
  }
  
  downgradeModeratorToReader(data){
    return this.http.post(`${this.uri}/user/downgradeModeratorToReader`, data);
  }

  blockUser(data){
    return this.http.post(`${this.uri}/user/blockUser`, data);
  }

  unblockUser(data){
    return this.http.post(`${this.uri}/user/unblockUser`, data);
  }

  acceptUser(data){
    return this.http.post(`${this.uri}/user/acceptUser`, data);
  }

  deleteUser(data){
    return this.http.post(`${this.uri}/user/deleteUser`, data);
  }

  rejectUser(data){
    return this.http.post(`${this.uri}/user/rejectUser`, data);
  }

  
}
