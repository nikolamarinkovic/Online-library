import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-modify-delete-user',
  templateUrl: './admin-modify-delete-user.component.html',
  styleUrls: ['./admin-modify-delete-user.component.css'],
})
export class AdminModifyDeleteUserComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.filter();
    
    this.userService.getAllUsers().subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.users = res.users;
      }
    });
  }

  users: User[] = new Array();

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

  upgradeReaderToModerator(user) {
    const data = {
      userId: user.id,
    };
    this.userService.upgradeReaderToModerator(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno unapredjen korisnik.');
      } else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }

  downgradeModeratorToReader(user) {
    const data = {
      userId: user.id,
    };
    this.userService.downgradeModeratorToReader(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno vracen korisnik.');
      } else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }

  blockUser(user) {
    const data = {
      userId: user.id,
    };
    this.userService.blockUser(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno blokiran korisnik.');
      } else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }

  unblockUser(user) {
    const data = {
      userId: user.id,
    };
    this.userService.unblockUser(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno odblokiran korisnik.');
      } else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }

  acceptUser(user) {
    const data = {
      userId: user.id,
    };
    this.userService.acceptUser(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno prihvacen korisnik.');
      } else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }


  rejectUser(user) {
    const data = {
      userId: user.id,
    };
    this.userService.rejectUser(data).subscribe((res: any) => {
      if (res.message == 'Ok') alert('Uspesno odbijen korisnik.');
      else if (res.message == 'Error') alert('Greska.');
      window.location.reload();
    });
  }

  deleteUser(user) {
    const data = {
      userId: user.id,
    };
    this.userService.deleteUser(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno izbrisan korisnik.');
      } else if (res.message == 'Error') alert(res.errorMessage);
      window.location.reload();
    });
  }

  goToUserModifyPage(user) {
    localStorage.setItem('userToChangeData', JSON.stringify(user));
    this.router.navigate(['adminChangeUserData']);
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
