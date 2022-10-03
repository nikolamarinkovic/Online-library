import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Book = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  authors: [
    {
      // array of Strings
      type: String,
    },
  ],
  genre: [
    {
      // array of Strings, max 3
      type: String,
    },
  ],
  publisher: {
    type: String,
  },
  publishYear: {
    type: Number,
  },
  language: {
    type: String,
  },
  photo: {
    type: String, // ime slike moze biti book_*idKnjige*, nece biti konflikta sa korisnicima, a default ime je book_defaultPhoto.jpg
  },
  userId: {
    type: Number,
  },
  numberInStock: {
    type: Number,
  },
  status: {
    type: String,
  },
  numberOfTimesTaken: {
    type: Number,
  },
  isBookOfTheDay: {
    type: Number, // 1 - jeste knjiga dana, 0 - nije knjiga dana, samo 1 knjiga u bazi bi trebalo da ima ovo
  },
});

export default mongoose.model("Book", Book, "books");
