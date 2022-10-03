import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Comment = new Schema({
  id: {
    type: Number,
  },
  userId: {
    type: Number,
  },
  bookId: {
    type: Number, // id ce biti ticket
  },
  content: {
    type: String,
  },
  modified: {
    type: Boolean,
  },
  date: {
    type: Date,
  },
});

export default mongoose.model("Comment", Comment, "comment");
