import express from "express";
import { BookGenreController } from "../controllers/bookGenre.controller";

const bookGenreRouter = express.Router();

bookGenreRouter.route("/getAllGenres").get((req, res) => {
    new BookGenreController().getAllGenres(req, res);
  });



  export default bookGenreRouter;