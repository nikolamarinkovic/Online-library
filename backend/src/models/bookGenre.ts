import mongoose from "mongoose";

const Schema = mongoose.Schema;

let BookGenre = new Schema({
  id: {
    type: Number, // id ce biti ticket
  },
  name: {
    type: String
  }
});

export default mongoose.model("BookGenre", BookGenre, "bookGenre");
