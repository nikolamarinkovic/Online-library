import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Book } from '../models/book';
import { UserService } from '../user.service';
import { BookService } from '../book.service';
import { BookGenreService } from '../book-genre.service';
import { BookGenre } from '../models/bookGenre';
import { RatingService } from '../rating.service';

@Component({
  selector: 'app-reader',
  templateUrl: './user.homepage.component.html',
  styleUrls: ['./user.homepage.component.css'],
})
export class UserHomepageComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private bookService: BookService,
    private bookGenreService: BookGenreService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.filter();

    // Only to escape error
    const book: Book = new Book();
    this.top3Books.push(book);
    this.top3Books.push(book);
    this.top3Books.push(book);

    this.newBook.authors = new Array(20);
    this.newBook.genre = new Array(20);
    this.user = null;

    this.initLoggedUser();
    this.initBookOfTheDay();
    

    this.bookGenreService.getAllGenres().subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.bookGenres = res.genres;
      }
    });

    const data = {
      userId: this.user.id,
    };
    this.bookService
      .getAllAcceptedBooksSuggestedByUser(data)
      .subscribe((res: any) => {
        if (res.message == 'Error') {
          return;
        }

        this.suggestedBooksByUser = res.books;
        this.initNotifications();
      });

    this.bookService.getTop3Books().subscribe((res: any) => {
      this.top3Books = res.books;
      this.currTop3Book = this.top3Books[0];
      this.initTop3Pictures();
    });
  }

  bookGenres: BookGenre[];

  user: User;
  photoName: string;
  picture?: string | ArrayBuffer;

  notifications: Array<string> = new Array();
  isNotificationTemporary: Array<boolean> = new Array();

  rentedBooksObj: Array<Book> = new Array();
  suggestedBooksByUser: Array<Book> = new Array();

  newBook: Book = new Book();
  authorsNumber: number = 0;

  msgInsertBook: string;

  bookOfTheDay: Book = new Book();
  pictureBookOfTheDay: string | ArrayBuffer;
  bookRating: number = 0;
  numOfRatings = 0;

  

  top3Pictures: Map<number, string | ArrayBuffer> = new Map();

  top3Books: Book[] = new Array();
  currTop3Book: Book = new Book();
  currTop3BookCnt: number = 0;

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

  initBookRating() {
    const data = {
      bookId: this.bookOfTheDay.id,
    };
    this.ratingService.getRatingsByBookId(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }

      this.numOfRatings = res.ratings.length;
      if (this.numOfRatings > 0) {
        let totalScore = 0;
        for (let i = 0; i < this.numOfRatings; ++i) {
          const rating = res.ratings[i].rating;
          totalScore += rating;
        }

        this.bookRating = totalScore / this.numOfRatings;
      }
    });
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

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  }

  goToSearch() {
    this.router.navigate(['readerSearch']);
  }

  goToRentedBooks() {
    this.router.navigate(['rentedBooks']);
  }

  goToRentHistory() {
    this.router.navigate(['rentHistory']);
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.newBook.photo = event.target.files[0];
    }
  }

  createRange(number) {
    return new Array(number);
  }

  goToBookDetails(book) {
    localStorage.setItem('currentBook', JSON.stringify(book));
    this.router.navigate(['bookInfo']);
  }

  initLoggedUser() {
    if (localStorage.getItem('loggedUser') != null) {
      this.user = JSON.parse(localStorage.getItem('loggedUser'));

      let id = this.user.id;

      const data3 = {
        id: id
      };
      this.userService.getUserById(data3).subscribe((res:any)=>{
        if(res.message == "Ok"){
          localStorage.setItem("loggedUser",JSON.stringify (res.user));
          
          this.user = res.user;

        }
      })

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
  }

  initNotifications() {
    const data = {
      bookIds: this.user.rentedBooks,
    };
    this.bookService.getBooksByIds(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }

      for (let i = 0; i < this.user.rentedBooks.length; ++i) {
        const daysLeft = this.calculateDateDiff(
          this.user.rentedBooksDateEnd[i]
        );
        if (daysLeft <= 0) {
          this.notifications.push(
            'Rok za vracanje knjige "' + res.books[i].name + '" je istekao.'
          );

          this.isNotificationTemporary.push(true);
        } else if (daysLeft <= 2) {
          this.notifications.push(
            'Rok za vracanje knjige "' +
              res.books[i].name +
              '" istice za ' +
              daysLeft +
              ' dana.'
          );
          this.isNotificationTemporary.push(true);
        }
      }

      if (this.user.rentedBooks.length == 3) {
        this.notifications.push('Imate 3 knjige na zaduzenju.');
        this.isNotificationTemporary.push(true);
      }

      if (this.user.reservedBooksAvailable.length > 0) {
        const dataBooks = {
          bookIds: this.user.reservedBooksAvailable,
        };

        this.bookService.getBooksByIds(dataBooks).subscribe((res: any) => {
          for (let i = 0; i < res.books.length; ++i) {
            const bookName = res.books[i].name;
            this.notifications.push(
              'Rezervisana knjiga "' +
                bookName +
                '" je dostupna i dodata je u listu zaduzenih knjiga.'
            );
          }
        });

        const dataUser = {
          userId: this.user.id,
        };

        this.userService
          .clearReservedBooksAvailable(dataUser)
          .subscribe((res: any) => {
            if (res.message == 'Error') {
              return;
            }
            this.user = res.user;
            localStorage.setItem('loggedUser', JSON.stringify(this.user));
          });
      }

      if (this.suggestedBooksByUser) {
        for (let i = 0; i < this.suggestedBooksByUser.length; ++i) {
          const bookName = this.suggestedBooksByUser[i].name;
          this.notifications.push(
            'Predlog za dodavanje knjige "' + bookName + '" je prihvacen.'
          );
          this.isNotificationTemporary.push(false);
        }
      }
      if (this.user.status == 'blocked') {
        this.notifications.push('Vas nalog je blokiran.');
        this.isNotificationTemporary.push(true);
      }
    });
  }

  initBookOfTheDay() {
    this.bookService.getBookOfTheDay().subscribe((resp: any) => {
      if (resp.message == 'Error') {
        /*this.bookOfTheDay = null;
        this.pictureBookOfTheDay = ""*/
      } else {
        this.bookOfTheDay = resp.books[0];
        this.initBookRating();
        let data = {
          photoName: this.bookOfTheDay.photo,
        };
        this.bookService.getBookPhoto(data).subscribe({
          next: (img: Blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (t) => {
              this.pictureBookOfTheDay = t.target?.result;
            };
          },
        });
      }
    });
  }



  initTop3Pictures() {
    this.top3Pictures.clear();
    this.top3Books.forEach((book) => {
      let id = book.id;
      let photoName = '' + book.photo;

      let data = {
        photoName: photoName,
      };

      this.bookService.getBookPhoto(data).subscribe({
        next: (img: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = (t) => {
            picture = t.target?.result;
            this.top3Pictures.set(id, picture);
          };
        },
      });

      let picture: string | ArrayBuffer;
    });
  }

  prevText() {
    this.currTop3BookCnt = (3 + this.currTop3BookCnt - 1) % 3;
    this.currTop3Book = this.top3Books[this.currTop3BookCnt];
  }

  nextText() {
    this.currTop3BookCnt = (this.currTop3BookCnt + 1) % 3;
    this.currTop3Book = this.top3Books[this.currTop3BookCnt];
  }

  goToSuggestBook(){
    this.router.navigate(['suggestBook'])
    return;
  }

  goToBookRequests(){
    this.router.navigate(['bookRequests'])
  }
}
