import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { UserHomepageComponent } from './user-homepage/user.homepage.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ReaderSearchComponent } from './reader-search/reader-search.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { RentedBooksComponent } from './rented-books/rented-books.component';
import { RentHistoryComponent } from './rent-history/rent-history.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminModifyDeleteUserComponent } from './admin-modify-delete-user/admin-modify-delete-user.component';
import { AdminAddBookComponent } from './admin-add-book/admin-add-book.component';
import { AdminModifyDeleteBookComponent } from './admin-modify-delete-book/admin-modify-delete-book.component';
import { AdminChangeRentTimeComponent } from './admin-change-rent-time/admin-change-rent-time.component';
import { AdminChangeUserDataComponent } from './admin-change-user-data/admin-change-user-data.component';
import { AdminChangeBookDataComponent } from './admin-change-book-data/admin-change-book-data.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuggestBookComponent } from './suggest-book/suggest-book.component';
import { BookRequestsComponent } from './book-requests/book-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    UserHomepageComponent,
    LoginAdminComponent,
    UserProfileComponent,
    BookInfoComponent,
    ReaderSearchComponent,
    BookInfoComponent,
    RentedBooksComponent,
    RentHistoryComponent,
    AdminAddUserComponent,
    AdminModifyDeleteUserComponent,
    AdminAddBookComponent,
    AdminModifyDeleteBookComponent,
    AdminChangeRentTimeComponent,
    AdminChangeUserDataComponent,
    AdminChangeBookDataComponent,
    LoginComponent,
    RegisterComponent,
    SuggestBookComponent,
    BookRequestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
