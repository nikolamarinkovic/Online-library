import mongoose from "mongoose";

const Schema = mongoose.Schema;

let BookReservation = new Schema({
  id: {
    type: Number, // id ce biti ticket
  },
  userId: {
    type: Number,
  },
  bookId: {
    type: Number
  }
});

export default mongoose.model("BookReservation", BookReservation, "bookReservation");
