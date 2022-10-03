import * as express from "express";
import BookGenre from "../models/bookGenre";

export class BookGenreController {
  getAllGenres = (req: express.Request, res: express.Response) => {
    BookGenre.find({}, (err: any, genres: any) => {
      if (err) res.json({ message: "Error", genres: [], errorMessage: err });
      else res.json({ message: "Ok", genres: genres });
    });
  };
}
