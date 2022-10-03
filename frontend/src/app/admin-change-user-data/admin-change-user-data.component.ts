import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-change-user-data',
  templateUrl: './admin-change-user-data.component.html',
  styleUrls: ['./admin-change-user-data.component.css'],
})
export class AdminChangeUserDataComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.filter();
    if (localStorage.getItem('userToChangeData') == null) {
      alert('Greska');
      this.router.navigate(['admin']);
    }

    this.user = JSON.parse(localStorage.getItem('userToChangeData'));
    this.photoName = '' + this.user.photo;

    let data = {
      photoName: this.photoName,
    };

    this.userService.getPhoto(data).subscribe({
      next: (img: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (t) => {
          this.picture = t.target?.result;
        };
      },
    });

    this.username = this.user.username;
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.address = this.user.address;
    this.phone = this.user.phone;
    this.email = this.user.email;
  }

  ngOnDestroy() {
    localStorage.removeItem('userToChangeData');
  }

  user: User;

  username: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
  confirmOldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  msgUpdateInfo: string = '';

  photoName: string;
  picture: string | ArrayBuffer;

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

  changeUserData() {
    if (this.username == undefined || this.username == '') {
      alert('Username prazno');
      return;
    }
    if (this.firstname == undefined || this.firstname == '') {
      alert('Ime prazno');
      return;
    }
    if (this.lastname == undefined || this.lastname == '') {
      alert('Prezime prazno');
      return;
    }
    if (this.address == undefined || this.address == '') {
      alert('Adresa prazna');
      return;
    }
    if (this.phone == undefined) {
      alert('Telefon prazan');
      return;
    }
    if (this.email == undefined || this.email == '') {
      alert('Email prazan');
      return;
    }

    const formData = new FormData();
    formData.set('userId', this.user.id.toString());
    formData.set('oldUsername', this.user.username);
    formData.set('oldEmail', this.user.email);
    formData.set('oldPassword', this.user.password);
    formData.set('username', this.username);
    formData.set('confirmOldPassword', this.confirmOldPassword);
    formData.set('newPassword', this.newPassword);
    formData.set('confirmNewPassword', this.confirmNewPassword);
    formData.set('firstname', this.firstname);
    formData.set('lastname', this.lastname);
    formData.set('address', this.address);
    formData.set('phone', this.phone);
    formData.set('email', this.email);

    this.userService.changeUserInfo(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgUpdateInfo = res.errors[0];
      } else {
        alert('Podaci su uspesno azurirani.');
        localStorage.setItem('userToChangeData', JSON.stringify(res.user));
        window.location.reload();
      }
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
