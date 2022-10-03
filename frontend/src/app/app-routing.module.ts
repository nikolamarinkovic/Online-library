import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAddBookComponent } from './admin-add-book/admin-add-book.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminChangeBookDataComponent } from './admin-change-book-data/admin-change-book-data.component';
import { AdminChangeRentTimeComponent } from './admin-change-rent-time/admin-change-rent-time.component';
import { AdminChangeUserDataComponent } from './admin-change-user-data/admin-change-user-data.component';
import { AdminModifyDeleteBookComponent } from './admin-modify-delete-book/admin-modify-delete-book.component';
import { AdminModifyDeleteUserComponent } from './admin-modify-delete-user/admin-modify-delete-user.component';
import { AdminComponent } from './admin/admin.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { HomeComponent } from './home/home.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { ReaderSearchComponent } from './reader-search/reader-search.component';
import { UserHomepageComponent } from './user-homepage/user.homepage.component';
import { RentHistoryComponent } from './rent-history/rent-history.component';
import { RentedBooksComponent } from './rented-books/rented-books.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuggestBookComponent } from './suggest-book/suggest-book.component';
import { BookRequestsComponent } from './book-requests/book-requests.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'adminAddBook', component: AdminAddBookComponent },
  { path: 'adminModifyDeleteBook', component: AdminModifyDeleteBookComponent },
  { path: 'adminAddUser', component: AdminAddUserComponent },
  { path: 'adminModifyDeleteUser', component: AdminModifyDeleteUserComponent },
  { path: 'adminChangeRentTime', component: AdminChangeRentTimeComponent },
  { path: 'adminChangeUserData', component: AdminChangeUserDataComponent },
  { path: 'adminChangeBookData', component: AdminChangeBookDataComponent },
  { path: 'bookInfo', component: BookInfoComponent },
  { path: 'bookRequests', component: BookRequestsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loginAdmin', component: LoginAdminComponent },
  { path: 'userHomepage', component: UserHomepageComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'readerSearch', component: ReaderSearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rentHistory', component: RentHistoryComponent },
  { path: 'rentedBooks', component: RentedBooksComponent },
  { path: 'suggestBook', component: SuggestBookComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
