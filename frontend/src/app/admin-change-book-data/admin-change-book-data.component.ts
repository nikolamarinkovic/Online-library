import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookGenreService } from '../book-genre.service';
import { BookService } from '../book.service';
import { Book } from '../models/book';
import { BookGenre } from '../models/bookGenre';

@Component({
  selector: 'app-admin-change-book-data',
  templateUrl: './admin-change-book-data.component.html',
  styleUrls: ['./admin-change-book-data.component.css']
})
export class AdminChangeBookDataComponent implements OnInit {

  constructor(private bookService: BookService, private router: Router, private bookGenreService: BookGenreService) { }

  ngOnInit(): void {
    this.filter()
    if(localStorage.getItem("adminChangeBook") == null){
      this.router.navigate(["admin"]);
      return;
    }

    this.bookGenreService.getAllGenres().subscribe((res:any)=>{
      if(res.message == "Ok"){
        this.bookGenres = res.genres;
      }
    })

    this.book = JSON.parse(localStorage.getItem("adminChangeBook"));
    
    this.name = this.book.name;
    this.authors = this.book.authors;
    this.numOfAuthors = this.authors.length;
    this.genres = this.book.genre;
    this.publisher = this.book.publisher;
    this.publishYear = this.book.publishYear;
    this.language = this.book.language;
    this.numberInStock = this.book.numberInStock;
  }

  book: Book = new Book();
  bookGenres: BookGenre[];
  
  name: string = "";
  authors: Array<string> =  new Array(20);
  numOfAuthors: number = 0;
  genres: Array<string> =  new Array();
  
  publisher: string = "";
  publishYear: number = 0;
  language: string = "";
  photo: File;
  numberInStock: number = -1;
  msg: string =  "";

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

  selectImage(event) {
    if (event.target.files.length) {
      this.photo = event.target.files[0];
    }
  }

  createRange(number) {
    return new Array(number);
  }

  changeBookInfo(){

    if(this.name == undefined || this.name == ""){
      alert("Unesize naziv.");
      return;
    }

    if(this.numOfAuthors == undefined || this.numOfAuthors <= 0){
      alert("Broj autora mora biti veci od 0.");
      return;
    }

    for(let i = 0; i < this.authors.length; i++){
      if(this.authors[i] == ""){
        alert("Unesite sve autore.");
        return;
      }
    }

    if(this.genres.length == 0){
      alert("Broj zanrova mora biti barem 1.");
      return;
    }

    if(this.genres.length > 3){
      alert("Broj zanrova mora biti maksimalno 3");
      return;
    }
    /* 8 */
   
    if(this.publisher == undefined || this.publisher == ""){
      alert("Unesite izdavaca.");
      return;
    }

    if(this.publishYear == undefined || this.publishYear == 0){
      alert("Unesite godinu izdavanja.");
      return;
    }

    if(this.language == undefined || this.language == ""){
      alert("Unesize jezik.");
      return;
    }

    if(this.numberInStock < 0 ){
      alert("Broj primeraka mora biti veci ili jednak od 0.");
      return;
    }



    const formData = new FormData();

    formData.set('id', this.book.id.toString());
    formData.set('name', this.name);
    let authorsTmp = this.authors.slice(0,this.numOfAuthors);
    formData.set('authors', authorsTmp.join(','));
    formData.set('genre', this.genres.join(','));
    formData.set('publisher', this.publisher);
    formData.set('publishYear', this.publishYear.toString());
    formData.set('language', this.language);
    formData.set('numberInStock', this.numberInStock.toString())
    if (this.photo != undefined) {
      formData.set('photo', this.photo);
    }

    this.bookService.changeBookInfo(formData).subscribe((res: any) => {
      if (res && res.errors != undefined && res.errors.length) {
        this.msg = res.errors[0];
      } else {
        alert('Knjiga uspesno izmenjena.');
        localStorage.setItem("adminChangeBook", JSON.stringify( res.book));
        window.location.reload();
      }
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }

}
