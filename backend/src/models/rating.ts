import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Rating = new Schema({
  userId: {
    type: Number,
  },
  bookId: {
    type: Number,
  },
  rating: {
    type: Number,
  },
});

export default mongoose.model("Rating", Rating, "ratings");
