import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.css']
})
export class AdminAddUserComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.filter()
    this.userReg = new User();
  }

  userReg: User;
  confirmPassword: string;
  msgRegister: string = "";

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

  register() {
    const formData = new FormData();
    formData.set('username', this.userReg.username);
    formData.set('password', this.userReg.password);
    formData.set('confirmPassword', this.confirmPassword);
    formData.set('firstname', this.userReg.firstname);
    formData.set('lastname', this.userReg.lastname);
    formData.set('address', this.userReg.address);
    formData.set('phone', this.userReg.phone);
    formData.set('email', this.userReg.email);
    if (this.userReg.photo != undefined) {
      formData.set('photo', this.userReg.photo);
    }
    formData.set('type', this.userReg.type);
    formData.set('status', 'accepted');

    this.userService.register(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgRegister = res.errors[0];
      } else {
        alert('Korisnik uspesno dodat!');
        window.location.reload();
      }
    });
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.userReg.photo = event.target.files[0];
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
