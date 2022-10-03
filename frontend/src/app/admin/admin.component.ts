import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filter()
  }

  filter() {
    if (localStorage.getItem('loggedUser') != null) {
      const user = JSON.parse(localStorage.getItem('loggedUser'));
      if (user.type != 'admin') {
        this.router.navigate(['userHomepage']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  adminAddBook() {
    this.router.navigate(['adminAddBook']);
  }

  adminModifyDeleteBook() {
    this.router.navigate(['adminModifyDeleteBook']);
  }

  adminAddUser() {
    this.router.navigate(['adminAddUser']);
  }

  adminModifyDeleteUser() {
    this.router.navigate(['adminModifyDeleteUser']);
  }

  adminChangeRentTime() {
    this.router.navigate(['adminChangeRentTime']);
  }
}
