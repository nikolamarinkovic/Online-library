import mongoose from "mongoose";

const Schema = mongoose.Schema;

let RentHistory = new Schema({
  userId: {
    type: Number,
  },
  bookId: {
    type: Number,
  },
  dateTaken: {
    type: Date,
  },
  dateReturned: {
    type: Date,
  },
});

export default mongoose.model("RentHistory", RentHistory, "rentHistory");
