import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  usernameLogin: string = '';
  passwordLogin: string = '';
  msgLogin: string = '';

  login() {
    const data = {
      username: this.usernameLogin,
      password: this.passwordLogin,
      type: null,
    };

    this.userService.login(data).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length > 0) {
        this.msgLogin = res.errors[0];
      } else {
        localStorage.setItem('loggedUser', JSON.stringify(res.user));
        this.router.navigate(['userHomepage']);
      }
    });
  }
}
