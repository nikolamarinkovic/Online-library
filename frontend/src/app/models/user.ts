export class User {
  id: number = -1;
  username: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  address: string = '';
  phone: string = '';
  email: string = '';
  photo: File;
  rentedBooks: Array<number> = [];
  rentedBooksDateStart: Array<Date> = [];
  rentedBooksDateEnd: Array<Date> = [];
  rentedBooksExtended: Array<boolean> = [];
  reservedBooksAvailable: Array<number> = [];
  type: string = 'reader';
  status: string = '';
}
