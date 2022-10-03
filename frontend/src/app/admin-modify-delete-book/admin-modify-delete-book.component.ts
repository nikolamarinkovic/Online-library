import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../models/book';

@Component({
  selector: 'app-admin-modify-delete-book',
  templateUrl: './admin-modify-delete-book.component.html',
  styleUrls: ['./admin-modify-delete-book.component.css'],
})
export class AdminModifyDeleteBookComponent implements OnInit {
  constructor(private router: Router, private bookService: BookService) {}

  ngOnInit(): void {
    this.filter();
    this.bookService.getAllBooks().subscribe((response: any) => {
      if (response.status == 'Error') return;
      this.books = response.books;
    });
  }

  books: Book[] = new Array();

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

  deleteBook(book) {
    const data = {
      id: book.id,
    };

    this.bookService.deleteBook(data).subscribe((resp: any) => {
      if (resp.message == 'Error') {
        alert(resp.errorMessage);
        return;
      }
      window.location.reload();
    });
  }

  changeInfoBook(book) {
    localStorage.setItem('adminChangeBook', JSON.stringify(book));
    this.router.navigate(['adminChangeBookData']);
  }

  changeBookToBookOfTheDay(book) {
    const data = {
      id: book.id,
    };

    this.bookService.setBookOfTheDay(data).subscribe((resp: any) => {
      if (resp.message == 'Error') {
        alert(resp.errorMessage);
        return;
      }
      window.location.reload();
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
