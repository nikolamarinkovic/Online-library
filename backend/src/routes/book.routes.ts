import express from "express";
import { BookController } from "../controllers/book.controller";

const bookRouter = express.Router();

/*bookRouter.route("/updateBookInfo").post((req, res) => {
  req.checkBody("name", "Naziv mora biti popunjen.").notEmpty();
  req.checkBody("authors", "Knjiga mora imati autora.").notEmpty();
  req.checkBody("genre", "Knjiga mora imati zanr.").notEmpty();
  req.checkBody("publisher", "Izdavac mora biti popunjen.").notEmpty();
  req.checkBody("publishYear", "Godina izdavanja mora biti popunjena.").notEmpty();
  req.checkBody("language", "Jezik mora biti popunjen.").notEmpty();
  req.checkBody("numberInStock", "Broj knjiga na stanju mora biti popunjen.").notEmpty();

  req.getValidationResult().then((result) => {
    let errors = [];
    result.array().forEach((result) => {
      errors.push(result.msg);
    });

    if (errors.length > 0) return res.json({ errors: errors });

    new BookController().updateBookInfo(req, res);
  });
});*/

bookRouter.route("/insertBook").post((req, res) => {
  req.checkBody("name", "Naziv mora biti popunjen.").notEmpty();
  req.checkBody("authors", "Autor mora biti popunjen.").notEmpty();
  req.checkBody("genre", "Zanr mora biti popunjen.").notEmpty();
  req.checkBody("publisher", "Izdavac mora biti popunjen.").notEmpty();
  req.checkBody("publishYear", "Godina izdavanja mora biti popunjena.").notEmpty();
  req.checkBody("language", "Jezik mora biti popunjen.").notEmpty();

  req.getValidationResult().then((result) => {
    let errors = [];
    result.array().forEach((result) => {
      errors.push(result.msg);
    });

    if (req.body.genre.split(", ").length > 3) errors.push("Knjiga moze imati najvise 3 zanra.");

    if (errors.length > 0) return res.json({ errors: errors });

    new BookController().insertBook(req, res);
  });
});

bookRouter.route("/acceptBook").post((req, res) => {
  new BookController().acceptBook(req, res);
});

bookRouter.route("/getAllAcceptedBooksSuggestedByUser").post((req, res) => {
  new BookController().getAllAcceptedBooksSuggestedByUser(req, res);
});

bookRouter.route("/getRentedBooksByUser").post((req, res) => {
  new BookController().getRentedBooksByUser(req, res);
});

bookRouter.route("/getAllBooks").get((req, res) => {
  new BookController().getAllBooks(req, res);
});

bookRouter.route("/getAllPendingBooks").get((req, res) => {
  new BookController().getAllPendingBooks(req, res);
});

bookRouter.route("/getAllAcceptedBooks").get((req, res) => {
  new BookController().getAllAcceptedBooks(req, res);
});

bookRouter.route("/getPhoto").post((req, res) => {
  new BookController().getPhoto(req, res);
});

bookRouter.route("/searchAcceptedBooksByParam").post((req, res) => {
  new BookController().searchAcceptedBooksByParam(req, res);
});

bookRouter.route("/getTop3Books").get((req, res) => {
  new BookController().getTop3Books(req, res);
});

bookRouter.route("/getBookOfTheDay").get((req, res) => {
  new BookController().getBookOfTheDay(req, res);
});

bookRouter.route("/getBooksByIdsRepeat").post((req, res) => {
  new BookController().getBooksByIdsRepeat(req, res);
});

bookRouter.route("/getBooksByIds").post((req, res) => {
  new BookController().getBooksByIds(req, res);
});

bookRouter.route("/takeBook").post((req, res) => {
  new BookController().takeBook(req, res);
});

bookRouter.route("/reserveBook").post((req, res) => {
  new BookController().reserveBook(req, res);
});

bookRouter.route("/deleteBook").post((req, res) => {
  new BookController().deleteBook(req, res);
});

bookRouter.route("/setBookOfTheDay").post((req, res) => {
  new BookController().setBookOfTheDay(req, res);
});

bookRouter.route("/changeBookInfo").post((req, res) => {
  new BookController().changeBookInfo(req, res);
});

bookRouter.route("/denyBook").post((req, res) => {
  new BookController().denyBook(req, res);
});

export default bookRouter;
