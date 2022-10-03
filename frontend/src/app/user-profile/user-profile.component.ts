import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Chart } from 'node_modules/chart.js';
import { registerables } from 'chart.js';
import { RentHistoryService } from '../rent-history.service';
import { BookService } from '../book.service';
import { BookGenreService } from '../book-genre.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private rentHistoryService: RentHistoryService,
    private bookService: BookService,
    private bookGenreService: BookGenreService
  ) {}

  ngOnInit(): void {
    this.filter();

    this.user = null;
    if (localStorage.getItem('loggedUser') != null) {
      this.user = JSON.parse(localStorage.getItem('loggedUser'));
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
    }
    Chart.register(...registerables);
    this.initChart();
  }

  user: User;
  photoName: string;
  picture?: string | ArrayBuffer;
  changingInfo: boolean = false;
  username: string = "";
  firstname: string = "";
  lastname: string = "";
  address: string = "";
  phone: string = "";
  email: string = "";
  photo: File;
  confirmOldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  msgUpdateInfo: string;

  filter() {
    if (localStorage.getItem('loggedUser') != null) {
      const user = JSON.parse(localStorage.getItem('loggedUser'));
      if (user.type == 'admin') {
        this.router.navigate(['admin']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  }

  beginChangingInfo() {
    this.changingInfo = true;

    this.username = this.user.username;
    this.confirmOldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.address = this.user.address;
    this.phone = this.user.phone;
    this.email = this.user.email;
  }

  // typeOfChange - are we changing username/firstname/lastname...
  submitChangingInfo(typeOfChange) {
    const formData = new FormData();
    formData.set('userId', this.user.id.toString());
    formData.set('oldUsername', this.user.username);
    formData.set('oldEmail', this.user.email);
    formData.set('oldPassword', this.user.password);

    let formUsername = this.user.username
    let formFirstname = this.user.firstname
    let formLastname = this.user.lastname
    let formAddress = this.user.address
    let formPhone = this.user.phone
    let fromEmail = this.user.email
    let formConfirmedOldPassword = ""
    let formNewPassword = ""
    let formConfirmNewPassword = ""

    if(typeOfChange == 'username'){
      formUsername = this.username
    }
    else if(typeOfChange == "firstname"){
      formFirstname = this.firstname
    }
    else if(typeOfChange == "lastname"){
      formLastname = this.lastname;
    }
    else if(typeOfChange == "address"){
      formAddress = this.address;
    }
    else if(typeOfChange == "phone"){
      formPhone = this.phone;
    }
    else if(typeOfChange == "email"){
      fromEmail = this.email;
    }
    else if(typeOfChange == "password"){
      formConfirmedOldPassword = this.confirmOldPassword
      formNewPassword = this.newPassword
      formConfirmNewPassword = this.confirmNewPassword
    }

    else if(typeOfChange == "picture"){
      if (this.photo != undefined) {
        formData.set('photo', this.photo);
      }
      this.msgUpdateInfo = "Niste izabrali novu sliku.";
      return;
    }

    formData.set('username', formUsername);
    formData.set('firstname', formFirstname);
    formData.set('lastname', formLastname);
    formData.set('address', formAddress);
    formData.set('phone', formPhone);
    formData.set('email', fromEmail);
    formData.set('confirmOldPassword', formConfirmedOldPassword);
    formData.set('newPassword', formNewPassword);
    formData.set('confirmNewPassword', formConfirmNewPassword);


    this.userService.changeUserInfo(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgUpdateInfo = res.errors[0];
      } else {
        alert('Podaci su uspesno azurirani.');
        if (this.newPassword) {
          this.logout();
        } else {
          localStorage.setItem('loggedUser', JSON.stringify(res.user));
          window.location.reload();
        }
      }
    });

    this.changingInfo = false;
  }

  cancelChangingInfo() {
    this.changingInfo = false;

    this.confirmOldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.photo = event.target.files[0];
    }
  }

  calculateDateDiff(dateEnd: Date) {
    const today = new Date();
    dateEnd = new Date(dateEnd);

    return Math.floor(
      (Date.UTC(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()) -
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  initChart() {
    const data = {
      userId: this.user.id,
    };
    this.rentHistoryService.getUserRentHistory(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }

      const booksRead = res.rentHistory;

      let booksPerMonth = new Array(12).fill(0);
      let bookIds = [];

      for (let i = 0; i < booksRead.length; ++i) {
        bookIds.push(booksRead[i].bookId);
        if (this.calculateDateDiff(booksRead[i].dateReturned) < 365) {
          const index = new Date(booksRead[i].dateReturned).getMonth();
          booksPerMonth[index]++;
        }
      }

      new Chart('booksPerMonthChart', {
        type: 'line',
        data: {
          labels: [
            'Januar',
            'Februar',
            'Mart',
            'April',
            'Maj',
            'Jun',
            'Jul',
            'Avgust',
            'Septembar',
            'Oktobar',
            'Novembar',
            'Decembar',
          ],
          datasets: [
            {
              label: 'Broj procitanih knjiga po mesecima',
              data: booksPerMonth,
              backgroundColor: ['rgba(254, 62, 35, 1)'],
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,1)'
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
        
      });

      this.bookGenreService.getAllGenres().subscribe((res: any) => {
        const genreList = res.genres;
        const genreListNames = [];
        for (let i = 0; i < genreList.length; ++i) {
          genreListNames.push(genreList[i].name);
        }
        const data = {
          bookIds: bookIds,
        };
        this.bookService.getBooksByIdsRepeat(data).subscribe((res: any) => {
          const books = res.books;

          let booksPerGenre = new Array(genreList.length).fill(0);

          for (let i = 0; i < books.length; ++i) {
            const genreArray = books[i].genre;
            for (let j = 0; j < genreArray.length; ++j) {
              for (let k = 0; k < genreList.length; ++k) {
                if (genreList[k].name == genreArray[j]) {
                  booksPerGenre[k]++;
                  break;
                }
              }
            }
          }

          new Chart('booksPerGenreChart', {
            type: 'line',
            data: {
              labels: genreListNames,
              datasets: [
                {
                  label: 'Broj procitanih knjiga po zanrovima',
                  data: booksPerGenre,
                  backgroundColor: ['rgba(5, 246, 86, 0.2)'],
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,1)'
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            },
          });
        });
      });
    });
  }

  // getIndexForGenre(genre) {
  //   switch (genre) {
  //     case 'Komedija':
  //       return 0;
  //     case 'Tragedija':
  //       return 1;
  //     case 'Drama':
  //       return 2;
  //     case 'Naucna fantastika':
  //       return 3;
  //     case 'Samopomoc':
  //       return 4;
  //     case 'Popularna psihologija':
  //       return 5;
  //     case 'Zdravlje':
  //       return 6;
  //     case 'Poezija':
  //       return 7;
  //   }
  // }

  // initChart() {
  //   const data = {
  //     userId: this.user.id,
  //   };
  //   this.rentHistoryService.getUserRentHistory(data).subscribe((res: any) => {
  //     if (res.message == 'Error') {
  //       return;
  //     }

  //     const booksRead = res.rentHistory;

  //     let booksPerMonth = new Array(12).fill(0);
  //     let bookIds = [];

  //     for (let i = 0; i < booksRead.length; ++i) {
  //       bookIds.push(booksRead[i].bookId);
  //       if (this.calculateDateDiff(booksRead[i].dateReturned) < 365) {
  //         const index = new Date(booksRead[i].dateReturned).getMonth();
  //         booksPerMonth[index]++;
  //       }
  //     }

  //     new Chart('booksPerMonthChart', {
  //       type: 'bar',
  //       data: {
  //         labels: [
  //           'Januar',
  //           'Februar',
  //           'Mart',
  //           'April',
  //           'Maj',
  //           'Jun',
  //           'Jul',
  //           'Avgust',
  //           'Septembar',
  //           'Oktobar',
  //           'Novembar',
  //           'Decembar',
  //         ],
  //         datasets: [
  //           {
  //             label: 'Broj procitanih knjiga po mesecima',
  //             data: booksPerMonth,
  //             backgroundColor: ['rgba(54, 162, 235, 0.2)'],
  //             borderWidth: 1,
  //           },
  //         ],
  //       },
  //       options: {
  //         scales: {
  //           y: {
  //             beginAtZero: true,
  //             ticks: {
  //               precision: 0,
  //             },
  //           },
  //         },
  //       },
  //     });

  //     const data = {
  //       bookIds: bookIds,
  //     };
  //     this.bookService.getBooksByIdsRepeat(data).subscribe((res: any) => {
  //       const books = res.books;

  //       let booksPerGenre = new Array(8).fill(0);

  //       for (let i = 0; i < books.length; ++i) {
  //         const genreArray = books[i].genre;
  //         for (let j = 0; j < genreArray.length; ++j) {
  //           const index = this.getIndexForGenre(genreArray[j]);
  //           booksPerGenre[index]++;
  //         }
  //       }

  //       new Chart('booksPerGenreChart', {
  //         type: 'bar',
  //         data: {
  //           labels: [
  //             'Komedija',
  //             'Tragedija',
  //             'Drama',
  //             'Naucna fantastika',
  //             'Samopomoc',
  //             'Popularna psihologija',
  //             'Zdravlje',
  //             'Poezija',
  //           ],
  //           datasets: [
  //             {
  //               label: 'Broj procitanih knjiga po zanrovima',
  //               data: booksPerGenre,
  //               backgroundColor: ['rgba(255, 206, 86, 0.2)'],
  //               borderWidth: 1,
  //             },
  //           ],
  //         },
  //         options: {
  //           scales: {
  //             y: {
  //               beginAtZero: true,
  //               ticks: {
  //                 precision: 0,
  //               },
  //             },
  //           },
  //         },
  //       });
  //     });
  //   });
  // }
}
