import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { User } from '../models/user';
import { RentHistoryService } from '../rent-history.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-rented-books',
  templateUrl: './rented-books.component.html',
  styleUrls: ['./rented-books.component.css'],
  providers: [DatePipe],
})
export class RentedBooksComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private bookService: BookService,
    private rentHistoryService: RentHistoryService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.filter()
    this.user = null;
    if (localStorage.getItem('loggedUser') != null) {
      this.user = JSON.parse(localStorage.getItem('loggedUser'));
      this.photoName = '' + this.user.photo;

      const dataUser = {
        photoName: this.photoName,
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

      const dataBook = {
        rentedBooksIds: this.user.rentedBooks,
      };

      this.bookService.getRentedBooksByUser(dataBook).subscribe((res: any) => {
        if (res.errors != undefined && res.errors.length > 0) {
          this.msgRentedBooks = res.errors[0];
        }
        this.rentedBooks = res.books;
        this.bookPhotos = new Array(this.rentedBooks.length);
        for (let i = 0; i < this.rentedBooks.length; ++i) {
          const dataBook = {
            photoName: this.rentedBooks[i].photo,
          };

          this.bookService.getBookPhoto(dataBook).subscribe({
            next: (img: Blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(img);
              reader.onload = (t) => {
                this.bookPhotos[i] = t.target?.result;
              };
            },
          });
        }
      });
    }
  }

  user: User;
  photoName: string;
  picture?: string | ArrayBuffer;

  rentedBooks: Array<Book>;
  bookPhotos?: Array<string | ArrayBuffer>;

  msgRentedBooks: string;

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

  goToBookDetails(book) {
    localStorage.setItem('currentBook', JSON.stringify(book));
    this.router.navigate(['bookInfo']);
  }

  extendBookReturnDeadline(bookIndex, bookId) {
    const dataUser = {
      userId: this.user.id,
      bookIndex: bookIndex,
    };

    this.userService
      .extendBookReturnDeadline(dataUser)
      .subscribe((res: any) => {
        if (res.message == 'Error') {
          console.log('Greska kod korisnika prilikom vracanja knjige.');
        } else {
          localStorage.setItem('loggedUser', JSON.stringify(res.user));
          window.location.reload();
        }
      });
  }

  returnBook(bookIndex, bookId) {
    const dataUser = {
      userId: this.user.id,
      bookIndex: bookIndex,
      bookId: bookId,
    };

    this.userService.returnBook(dataUser).subscribe((res: any) => {
      if (res.message == 'Error') {
        console.log('Greska kod korisnika prilikom vracanja knjige.');
      } else {
        localStorage.setItem('loggedUser', JSON.stringify(res.user));

        const dateStart = this.user.rentedBooksDateStart[bookIndex];
        const dateEnd = new Date();

        const dataHistory = {
          userId: this.user.id,
          bookId: this.user.rentedBooks[bookIndex],
          dateTaken: this.datePipe.transform(dateStart, 'yyyy-MM-dd'),
          dateReturned: this.datePipe.transform(dateEnd, 'yyyy-MM-dd'),
        };

        this.rentHistoryService
          .addBookToHistory(dataHistory)
          .subscribe((res: any) => {
            if (res.message == 'Error') {
              console.log('Greske prilikom dodavanja knjige u istoriju.');
            } else {
              console.log('Knjiga je uspesno dodata u istoriju zaduzivanja.');
              window.location.reload();
            }
          });
      }
    });
  }

  calculateDateDiff(dateEnd) {
    const today = new Date();
    dateEnd = new Date(dateEnd);

    return Math.floor(
      (Date.UTC(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()) -
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  }
}
