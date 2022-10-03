import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookGenreService } from '../book-genre.service';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { BookGenre } from '../models/bookGenre';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reader-search',
  templateUrl: './reader-search.component.html',
  styleUrls: ['./reader-search.component.css'],
})
export class ReaderSearchComponent implements OnInit {
  constructor(
    private router: Router,
    private bookService: BookService,
    private bookGenreService: BookGenreService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.filter()
    this.bookService.getAllAcceptedBooks().subscribe((res: any) => {
      this.allBooks = res.books;
      this.initPictures();

      this.bookGenreService.getAllGenres().subscribe((res: any) => {
        if ((res.message = 'Ok')) {
          this.genreOptions = res.genres;
        }
      });
    });

    if (localStorage.getItem('loggedUser') != null) {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      let photoName = '' + this.loggedUser.photo;

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
    }
  }

  allBooks: Book[];
  bookName: string = '';

  pictures: Map<number, string | ArrayBuffer> = new Map();

  genreOptions: BookGenre[];
  selectedGenres: Array<string> = new Array();

  publishYearFrom: number;
  publishYearTo: number;
  publisher: string;

  author: string;
  loggedUser: User;
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

  startSearch() {
    let name: string = this.bookName;
    let genres: Array<string> = this.selectedGenres;
    let yearFrom: number = this.publishYearFrom;
    let yearTo: number = this.publishYearTo;
    let publisherTmp: string = this.publisher;
    let authorTmp: string = this.author;

    if (this.bookName == undefined || this.bookName == null) {
      name = '';
    }

    if (this.publishYearFrom == undefined) {
      yearFrom = -1;
    }

    if (this.publishYearTo == undefined) {
      yearTo = 4000;
    }

    if (this.publisher == undefined || this.publisher == null) {
      publisherTmp = '';
    }

    if (this.author == undefined || this.author == null) {
      authorTmp = '';
    }

    const data = {
      name: name,
      genres: genres,
      yearFrom: yearFrom,
      yearTo: yearTo,
      publisher: publisherTmp,
      author: authorTmp,
    };

    this.bookService.searchAcceptedBooksByParam(data).subscribe((res: any) => {
      this.allBooks = res.books;
      this.initPictures();
    });
  }

  goToBookDetails(book) {
    if (localStorage.getItem('loggedUser') == null) return;

    let user: User = JSON.parse(localStorage.getItem('loggedUser'));

    localStorage.setItem('currentBook', JSON.stringify(book));
    this.router.navigate(['bookInfo']);
  }

  initPictures() {
    this.pictures.clear();
    this.allBooks.forEach((book) => {
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
            this.pictures.set(id, picture);
          };
        },
      });

      let picture: string | ArrayBuffer;
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

  goToUserProfile() {
    this.router.navigate(['userProfile']);
  }
}
