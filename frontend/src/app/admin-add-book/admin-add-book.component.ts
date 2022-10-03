import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookGenreService } from '../book-genre.service';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { BookGenre } from '../models/bookGenre';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-add-book',
  templateUrl: './admin-add-book.component.html',
  styleUrls: ['./admin-add-book.component.css'],
})
export class AdminAddBookComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private bookGenreService: BookGenreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filter()

    this.user = JSON.parse(localStorage.getItem('loggedUser'));
    this.newBook.authors = new Array(20);
    this.newBook.genre = new Array(20);

    this.bookGenreService.getAllGenres().subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.bookGenres = res.genres;
      }
    });
  }

  newBook: Book = new Book();
  authorsNumber: number = 0;
  user: User = new User();
  msgInsertBook: string = '';

  bookGenres: BookGenre[];

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

  insertBook() {
    if (this.newBook.name == undefined || this.newBook.name == '') {
      this.msgInsertBook = 'Unesite naziv knjige.';
      return;
    }

    if (this.authorsNumber <= 0) {
      this.msgInsertBook = 'Unesite validan broj autora.';
      return;
    }

    for (let i = 0; i < this.authorsNumber; i++) {
      if (
        this.newBook.authors[i] == undefined ||
        this.newBook.authors[i] == ''
      ) {
        this.msgInsertBook = 'Unesite sve autore.';
        return;
      }
    }

    if (this.newBook.genre[0] == '' || this.newBook.genre[0] == undefined) {
      this.msgInsertBook = 'Unesite zanr knjige.';
      return;
    }

    if (this.newBook.publisher == undefined || this.newBook.publisher == '') {
      this.msgInsertBook = 'Unesite izdavaca knjige.';
      return;
    }

    if (this.newBook.publishYear == undefined) {
      this.msgInsertBook = 'Unesite godinu izdavanja knjige.';
      return;
    }

    if (this.newBook.language == undefined || this.newBook.language == '') {
      this.msgInsertBook = 'Unesite jezik.';
      return;
    }

    let authorsArrayToString: string = '';
    for (let i = 0; i < this.authorsNumber; ++i) {
      authorsArrayToString += this.newBook.authors[i];
      if (i < this.authorsNumber - 1) authorsArrayToString += ',';
    }

    let genreArrayToString: string = '';
    for (let i = 0; i < this.newBook.genre.length; ++i) {
      genreArrayToString += this.newBook.genre[i];
      if (i < this.newBook.genre.length - 1) genreArrayToString += ',';
    }

    const formData = new FormData();
    formData.set('name', this.newBook.name);
    formData.set('authors', authorsArrayToString);
    formData.set('genre', genreArrayToString);
    formData.set('publisher', this.newBook.publisher);
    formData.set('publishYear', this.newBook.publishYear.toString());
    formData.set('language', this.newBook.language);
    if (this.newBook.photo != undefined) {
      formData.set('photo', this.newBook.photo);
    }
    formData.set('userId', this.user.id.toString());
    formData.set('status', 'accepted');

    this.bookService.insertBook(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgInsertBook = res.errors[0];
      } else {
        alert('Knjiga uspesno dodata');
        window.location.reload();
      }
    });
  }

  createRange(number) {
    return new Array(number);
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.newBook.photo = event.target.files[0];
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
