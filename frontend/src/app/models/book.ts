export class Book {
  id: number = -1;
  name: string = '';
  authors: Array<string> = [];
  genre: Array<string> = [];
  publisher: string = '';
  publishYear: number;
  language: string = '';
  photo: File;
  userId: number = -1;
  numberInStock: number = -1;
  status: string = '';
  numberOfTimesTaken: number = 0;
  isBookOfTheDay: number = 0;
}
