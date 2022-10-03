import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import mongoose from "mongoose";
import multer from "multer";
import userRouter from "./routes/user.routes";
import bookRouter from "./routes/book.routes";
import rentHistoryRouter from "./routes/rentHistory.routes";
import rentLengthRouter from "./routes/rentLength.routes";
import bookGenreRouter from "./routes/bookGenre.routes";
import commentRouter from "./routes/comment.routes";
import ratingRouter from "./routes/rating.routes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());

mongoose.connect("mongodb://localhost:27017/bookstore");

const connection = mongoose.connection;
const port = 4000;

connection.once("open", () => {
  console.log("Connection successful");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.single("photo"));

const router = express.Router();
router.use("/user", userRouter);
router.use('/book', bookRouter);
router.use("/rentHistory", rentHistoryRouter);
router.use("/rentLength", rentLengthRouter);
router.use("/genre", bookGenreRouter);
router.use("/comment", commentRouter);
router.use("/rating", ratingRouter);


app.use("/", router);

app.listen(port, () => console.log(`Express server running on port ` + port));
