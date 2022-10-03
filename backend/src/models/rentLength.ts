import mongoose from "mongoose";

const Schema = mongoose.Schema;

let RentLength = new Schema({
  id: {
    type: Number, // bice 1
  },
  length: {
    type: Number,
  },
});

export default mongoose.model("RentLength", RentLength, "rentLength");
