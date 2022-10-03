import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookGenreService } from '../book-genre.service';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { BookGenre } from '../models/bookGenre';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-suggest-book',
  templateUrl: './suggest-book.component.html',
  styleUrls: ['./suggest-book.component.css']
})
export class SuggestBookComponent implements OnInit {

  constructor(private userService: UserService, private bookService: BookService, private bookGenreService:BookGenreService, private router:Router) { }

  ngOnInit(): void {
    this.filter();

    this.newBook.authors = new Array(20);
    this.newBook.genre = new Array(20);

    this.initLoggedUser();
    this.initBookGenres();
    
  }

  user: User = new User();
  msgInsertBook: string = " ";
  newBook: Book = new Book();
  authorsNumber: number = 1;
  bookGenres: BookGenre[] = new Array();


  createRange(number: number) {
    return new Array(number);
  }

  selectImage(event) {
    if (event.target.files.length) {
      this.newBook.photo = event.target.files[0];
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

    let authors: string = '';
    for (let i = 0; i < this.authorsNumber; i++) {
      authors += this.newBook.authors[i];
      if (i != this.authorsNumber - 1) authors += ',';
    }

    const formData = new FormData();
    formData.set('name', this.newBook.name);
    //formData.set('authors', this.newBook.authors.join(', '));
    formData.set('authors', authors);
    formData.set('genre', this.newBook.genre.join(','));
    formData.set('publisher', this.newBook.publisher);
    formData.set('publishYear', this.newBook.publishYear.toString());
    formData.set('language', this.newBook.language);
    if (this.newBook.photo != undefined) {
      formData.set('photo', this.newBook.photo);
    }
    formData.set('userId', this.user.id.toString());
    formData.set('status', this.user.type == 'reader' ? 'pending' : 'accepted');

    this.bookService.insertBook(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msgInsertBook = res.errors[0];
      } else {
        if (this.user.type == 'reader')
          alert('Zahtev za umetanje nove knjige uspesno poslat!');
        else if (this.user.type == 'moderator') alert('Knjiga uspesno dodata!');
        window.location.reload();
      }
    });
  }

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
    }
  }

  initBookGenres() {
    this.bookGenreService.getAllGenres().subscribe((res: any) => {
      if (res.message == 'Ok') {
        this.bookGenres = res.genres;
      }
    });
  }

}
