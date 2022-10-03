import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-book-requests',
  templateUrl: './book-requests.component.html',
  styleUrls: ['./book-requests.component.css']
})
export class BookRequestsComponent implements OnInit {

  constructor(private userService:UserService, private bookService: BookService) { }

  ngOnInit(): void {

    this.initLoggedUser()
    this.initPendingBooks();
  }

  user: User = new User;
  pendingBooks: Array<Book> = [];
  userSuggestersUsernames: Array<string> = [];

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

  initPendingBooks() {
    this.bookService.getAllPendingBooks().subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }
      this.pendingBooks = res.books;
      for (let book of this.pendingBooks) {
        let data = {
          id: book.userId,
        };
        this.userService.getUserById(data).subscribe((res: any) => {
          if (res.message == 'Ok') {
            this.userSuggestersUsernames.push(res.user.username);
          }
        });
      }
    });
  }

  acceptBookRequest(bookId) {
    const data = {
      bookId: bookId,
    };

    this.bookService.acceptBook(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }
      alert("Uspesno prihvacena knjiga")
      window.location.reload();
    });
  }

  denyBookRequest(bookId) {
    const data = {
      bookId: bookId,
    };

    this.bookService.denyBook(data).subscribe((res: any) => {
      if (res.message == 'Error') {
        return;
      }
      alert("Uspesno odbijena knjiga")
      window.location.reload();
    });
  }
}
