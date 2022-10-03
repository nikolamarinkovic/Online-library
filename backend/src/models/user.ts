import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema({
  id: {
    type: Number,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  photo: {
    type: String,
  },
  rentedBooks: [{
    type: Number,
  }],
  rentedBooksDateStart: [{
    type: Date,
  }],
  rentedBooksDateEnd: [{
    type: Date,
  }],
  rentedBooksExtended: [{
    type: Boolean,
  }],
  reservedBooksAvailable: [{
    type: Number,
  }],
  type: {
    type: String,
  },
  status: {
    type: String,
  },
});

export default mongoose.model("User", User, "users");
