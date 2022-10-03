import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.filter();
  }

  usernameLogin: string = '';
  passwordLogin: string = '';
  msgLogin: string = '';

  filter() {
    if (localStorage.getItem('loggedUser') != null) {
      const user = JSON.parse(localStorage.getItem('loggedUser'));
      if (user.type != 'admin') {
        this.router.navigate(['userHomepage']);
      } else {
        this.router.navigate(['admin']);
      }
    }
  }

  login() {
    const data = {
      username: this.usernameLogin,
      password: this.passwordLogin,
      type: 'admin',
    };

    this.userService.login(data).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length > 0) {
        this.msgLogin = res.errors[0];
      } else {
        localStorage.setItem('loggedUser', JSON.stringify(res.user));
        this.router.navigate(['admin']);
      }
    });
  }
}
