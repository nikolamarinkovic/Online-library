export class BookComment {
  id: number = -1;
  userId: number = -1;
  bookId: number = -1;
  content: string = '';
  modified: boolean = false;
  date: Date = new Date();
}
