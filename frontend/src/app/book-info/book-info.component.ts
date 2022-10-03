import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookGenreService } from '../book-genre.service';
import { BookService } from '../book.service';
import { CommentService } from '../comment.service';
import { Book } from '../models/book';
import { BookGenre } from '../models/bookGenre';
import { BookComment } from '../models/comment';
import { User } from '../models/user';
import { RatingService } from '../rating.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css'],
  providers: [DatePipe],
})
export class BookInfoComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private userService: UserService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private bookGenreService: BookGenreService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.filter();
    if (localStorage.getItem('currentBook') != null) {
      if (localStorage.getItem('loggedUser') == null) return;

      this.user = JSON.parse(localStorage.getItem('loggedUser'));
      this.book = JSON.parse(localStorage.getItem('currentBook'));

      this.userHasBook = this.checkIfUserHasCurrentBook();
      this.userHasMaxBooks = this.checkIfUserHasMaxBooks();
      this.userHasBookOverextended = this.checkIfUserHasBooksOverextended();

      this.bookInStock = this.checkIfBookInStock();

      this.eligibleForBook =
        this.userHasBook == false &&
        this.userHasMaxBooks == false &&
        this.userHasBookOverextended == false;

      this.initGenres();
      this.initBookRating();
      this.initComments();
      this.checkIfUserReservedBook();
      this.initProfilePicture();

      this.errorMessage += this.errors.join('. ');
      this.errorMessage += '.';

      this.photoName = '' + this.book.photo;

      this.initBookPhoto();

      let data = {
        photoName: this.photoName,
      };

      this.bookService.getBookPhoto(data).subscribe({
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

  ngOnDestroy(): void {
    //localStorage.removeItem('currentBook');
  }

  bookGenres: BookGenre[];

  book: Book;
  photoName: String;
  picture?: string | ArrayBuffer;

  user: User;
  pictureUser?: string | ArrayBuffer;
  errorMessage: string = 'Ne mozete zaduziti knjigu jer: ';
  errors: Array<string> = new Array();

  eligibleToTakeBook: boolean = false; // dal je eligible + dal ima knjige na stanju
  eligibleForBook: boolean = false; // dal je eligible da uzme knjigu
  eligibleToReserveBook: boolean = false; // dal je eligible + nema knjiga na stanju

  userHasBook: boolean = false;
  userHasMaxBooks: boolean = false;
  userHasBookOverextended: boolean = false;
  bookInStock: boolean = false;

  userReservedBook: boolean = false;

  orderInfo: string = '';

  comments: BookComment[] = new Array(); // ovde dohvatamo komentare iz baze
  fullComments = new Array(); // ovde cuvamo komentar, username korisnika
  commentContent: string = '';

  editingComment: boolean = false;
  newComment: string = '';

  rateValue: number = 1;
  bookRating: number = 0;
  numOfRatings = 0;

  changingInfo: boolean = false;
  msgUpdateInfo: string;

  name: string;
  authorsNumber: number = 0;
  authors: Array<string>;
  genre: Array<string>;
  publisher: string;
  publishYear: number;
  language: string;
  numberInStock: number;
  photo: File;
  

  filter() {
    if (localStorage.getItem('loggedUser') == null) {
      this.router.navigate(['']);
    }
  }

  initGenres() {
    this.bookGenreService.getAllGenres().subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.bookGenres = res.genres;
      }
    });
  }

  initBookRating() {
    const data = {
      bookId: this.book.id,
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

  initComments() {
    let data2 = {
      bookId: this.book.id,
    };
    this.commentService.getCommentsForBook(data2).subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.comments = res.comments;

        for (let comment of this.comments) {
          let data3 = {
            id: comment.userId,
          };
          this.userService.getUserById(data3).subscribe((resp: any) => {
            this.fullComments.push({
              comment: comment,
              username: resp.user.username,
              userId: comment.userId,
            });
          });
        }
      }
    });
  }

  initBookPhoto() {
    let data = {
      photoName: this.photoName,
    };
    this.bookService.getBookPhoto(data).subscribe({
      next: (img: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (t) => {
          this.picture = t.target?.result;
        };
      },
    });
  }

  rateBook() {
    const data = {
      bookId: this.book.id,
      userId: this.user.id,
      rating: this.rateValue,
    };
    this.ratingService.insertRating(data).subscribe((res: any) => {
      // nece doci do greske
      window.location.reload();
    });
  }

  checkIfUserHasCurrentBook() {
    let bookId = this.book.id;
    let userBooks = this.user.rentedBooks;

    let index = userBooks.findIndex((t) => t == bookId);
    if (index == -1) return false;

    this.errors.push('Vec imate knjigu');
    return true;
  }

  checkIfUserHasMaxBooks() {
    if (this.user.rentedBooks.length == 3) {
      this.errors.push('Imate maksimalan broj (3) knjiga');
      return true;
    } else return false;
  }

  checkIfUserHasBooksOverextended() {
    for (let date of this.user.rentedBooksDateEnd) {
      if (this.calculateDateDiff(date) < 0) {
        this.errors.push('Imate knjigu kojoj je isteklo vreme za vracanje');
        return true;
      }
    }
    return false;
  }

  checkIfBookInStock() {
    if (this.book.numberInStock > 0) {
      //this.errors.push("imate knjigu kojoj je isteklo vreme za vracanje");
      return true;
    } else return false;
  }

  checkIfUserReservedBook() {
    const data = {
      userId: this.user.id,
      bookId: this.book.id,
    };
    this.userService.getUserReservations(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        let reservations = res.reservations;
        for (let res of reservations) {
          if (res.bookId == this.book.id) {
            this.userReservedBook = false;
            this.userReservedBook = true;
            this.eligibleToTakeBook = false;
            this.eligibleToReserveBook = false;

            return;
          }
        }
        this.userReservedBook = false;

        this.eligibleToTakeBook =
          this.eligibleForBook && this.bookInStock == true;

        this.eligibleToReserveBook =
          this.eligibleForBook && this.bookInStock == false;
      }
    });
  }

  takeBook() {
    const data = {
      userId: this.user.id,
      bookId: this.book.id,
    };
    this.bookService.takeBook(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno ste zaduzili knjigu.');
        localStorage.setItem('loggedUser', JSON.stringify(res.user));
        localStorage.setItem('currentBook', JSON.stringify(res.book));
        //this.orderInfo = 'Uspesno uzeta knjiga.';
        window.location.reload();
      } else this.orderInfo = 'Greska pri uzimanju knjige.';
    });
  }

  reserveBook() {
    const data = {
      userId: this.user.id,
      bookId: this.book.id,
    };
    this.bookService.reserveBook(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno ste rezervisali knjigu.');
        this.orderInfo = 'Uspesno rezervisana knjiga.';
        window.location.reload();
      } else {
        this.orderInfo = 'Greska pri rezervisanju knjige.';
        this.orderInfo = res.errorMessage;
      }
    });
  }

  postComment() {
    let data = {
      userId: this.user.id,
      bookId: this.book.id,
      content: this.commentContent,
      rentedBookIds: this.user.rentedBooks
    };
    this.commentService.insertComment(data).subscribe((res: any) => {
      if (res.message == 'Ok') {
        alert('Uspesno dodat komentar.');
        window.location.reload();
        return;
      } else if (res.message == 'Error') {
        alert(res.errorMessage);
      }
    });
  }

  startEditingComment(comment) {
    this.newComment = comment.comment.content;
    this.editingComment = true;
  }

  cancelEditingComment() {
    this.editingComment = false;
  }

  changeComment() {
    let data = {
      userId: this.user.id,
      bookId: this.book.id,
      content: this.newComment,
    };
    this.commentService.changeComment(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        alert(res.errorMessage);
        this.editingComment = false;
        return;
      } else if (res.message == 'Ok') {
        alert('Uspesno promenjen komentar');
        this.editingComment = false;
        window.location.reload();
        return;
      }
    });
  }

  test() {
    for (let i = 0; i < this.fullComments.length; i++) {
      alert(this.fullComments[i]);
    }
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

  createRange(number) {
    return new Array(number);
  }

  beginChangingInfo() {
    this.changingInfo = true;

    this.name = this.book.name;
    this.authorsNumber = this.book.authors.length;
    this.authors = this.book.authors;
    this.genre = this.book.genre;
    this.publisher = this.book.publisher;
    this.publishYear = this.book.publishYear;
    this.language = this.book.language;
    this.numberInStock = this.book.numberInStock;
  }

  submitChangingInfo() {
    const formData = new FormData();
    formData.set('id', this.book.id.toString());
    formData.set('name', this.name);
    formData.set('authorsNumber', this.authorsNumber.toString());
    formData.set('authors', this.authors.join(','));
    formData.set('genre', this.genre.join(','));
    formData.set('publisher', this.publisher);
    formData.set('publishYear', this.publishYear.toString());
    formData.set('language', this.language);
    formData.set('numberInStock', this.numberInStock.toString());
    if (this.photo != undefined) {
      formData.set('photo', this.photo);
    }

    this.bookService.changeBookInfo(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgUpdateInfo = res.errors[0];
      } else {
        localStorage.setItem('currentBook', JSON.stringify(res.book));
        alert('Podaci uspesno izmenjeni!');
        window.location.reload();
      }
    });

    this.changingInfo = false;
  }

  cancelChangingInfo() {
    this.changingInfo = false;
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.photo = event.target.files[0];
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  }

  initProfilePicture() {
    this.photoName = '' + this.user.photo;

    let data = {
      photoName: this.photoName,
    };
    this.userService.getPhoto(data).subscribe({
      next: (img: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (t) => {
          this.pictureUser = t.target?.result;
        };
      },
    });
  }
}
