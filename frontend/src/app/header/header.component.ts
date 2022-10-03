import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.user = null;
    if (localStorage.getItem('loggedUser') != null) {
      this.user = JSON.parse(localStorage.getItem('loggedUser'));
      if (this.user) {
        //this.pictureName = this.user.photo;
      }
    }
  }

  pictureName: string = '';
  user: User;

  toHomePage() {
    if (localStorage.getItem('loggedUser') != null) {
      const userType = JSON.parse(localStorage.getItem('loggedUser')).type;
      this.router.navigate([userType]);
    } else {
      this.router.navigate(['']);
    }
  }
}
