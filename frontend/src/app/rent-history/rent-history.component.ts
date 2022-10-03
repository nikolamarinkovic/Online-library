import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { RentHistory } from '../models/rentHistory';
import { User } from '../models/user';
import { RentHistoryService } from '../rent-history.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-rent-history',
  templateUrl: './rent-history.component.html',
  styleUrls: ['./rent-history.component.css'],
})
export class RentHistoryComponent implements OnInit {
  constructor(
    private router: Router,
    private rentHistoryService: RentHistoryService,
    private bookService: BookService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.filter()
    if (localStorage.getItem('loggedUser') != null) {
      this.user = JSON.parse(localStorage.getItem('loggedUser'));
      let data = {
        userId: this.user.id,
      };

      let photoName = '' + this.user.photo;

      const dataUser = {
        photoName: photoName,
      };
      this.userService.getPhoto(dataUser).subscribe({
        next: (img: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = (t) => {
            this.picture = t.target?.result;
          };
        },
      });

      this.rentHistoryService.getUserRentHistory(data).subscribe((res: any) => {
        if (res.message == 'Ok') {
          this.rentHistory = res.rentHistory;
          let bookIdArray = new Array<number>();

          for (let elem of this.rentHistory) {
            bookIdArray.push(elem.bookId);
          }

          let data2 = {
            bookIds: bookIdArray,
          };

          this.bookService.getBooksByIds(data2).subscribe((res: any) => {
            if (res.message == 'Ok') {
              this.rentedBooks = res.books;
              for (let i = 0; i < this.rentHistory.length; i++) {
                let rent = this.rentHistory[i];
                let book2 = this.rentedBooks.find(
                  (book) => book.id == rent.bookId
                );

                let elem = {
                  book: book2,
                  dateTaken: rent.dateTaken,
                  dateReturned: rent.dateReturned,
                };

                this.totalHistory.push(elem);

                this.sortTotalHistory();
                //sort ovde
              }
            }
          });
        }
      });
    }
  }

  rentHistory: RentHistory[] = new Array<RentHistory>();
  rentedBooks: Book[] = new Array<Book>();

  totalHistory = new Array();
  user: User = new User();

  sortType: string = 'dateReturned';
  sortOrder: string = 'desc';
  picture?: string | ArrayBuffer;

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

  sortTotalHistory() {
    if (this.sortType == 'name') {
      if (this.sortOrder == 'asc') {
        this.totalHistory.sort((a, b) => {
          if (a.book.name > b.book.name) return 1;
          else if (a.book.name == b.book.name) return 0;
          else return -1;
        });
      } else {
        this.totalHistory.sort((a, b) => {
          if (a.book.name > b.book.name) return -1;
          else if (a.book.name == b.book.name) return 0;
          else return 1;
        });
      }
    } else if (this.sortType == 'authors') {
      this.totalHistory.sort((a, b) => {
        const authorFromA: string = a.book.authors[0];
        const authorFromB: string = b.book.authors[0];

        let lastNameAuthorA = authorFromA.split(' ')[1];
        let lastNameAuthorB = authorFromB.split(' ')[1];

        if (lastNameAuthorA > lastNameAuthorB) {
          if (this.sortOrder == 'asc') return 1;
          else return -1;
        } else if (lastNameAuthorA == lastNameAuthorB) return 0;
        else {
          if (this.sortOrder == 'asc') return -1;
          else return 1;
        }
      });
    } else if (this.sortType == 'dateTaken') {
      this.totalHistory.sort((a, b) => {
        if (a.dateTaken > b.dateTaken) {
          if (this.sortOrder == 'asc') return 1;
          else return -1;
        } else if (a.dateTaken == b.dateTaken) return 0;
        else {
          if (this.sortOrder == 'asc') return -1;
          else return 1;
        }
      });
    } else {
      this.totalHistory.sort((a, b) => {
        if (a.dateReturned > b.dateReturned) {
          if (this.sortOrder == 'asc') return 1;
          else return -1;
        } else if (a.dateReturned == b.dateReturned) return 0;
        else {
          if (this.sortOrder == 'asc') return -1;
          else return 1;
        }
      });
    }
  }

  goToBookDetails(elem) {
    let book = elem.book;

    localStorage.setItem('currentBook', JSON.stringify(book));
    this.router.navigate(['bookInfo']);
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  };

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  };
}
