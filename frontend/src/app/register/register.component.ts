import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userReg = new User();
  }

  userReg: User;
  confirmPassword: string = '';
  msgRegister: string = '';

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
    formData.set('type', 'reader');
    formData.set('status', 'pending');

    this.userService.register(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgRegister = res.errors[0];
      } else {
        alert('Zahtev za registraciju uspesno poslat!');
        window.location.reload();
      }
    });
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.userReg.photo = event.target.files[0];
    }
  }
}
