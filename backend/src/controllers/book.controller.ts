import * as express from "express";
import fs from "fs";
import User from "../models/user";
import Book from "../models/book";
import RentLength from "../models/rentLength";
import BookReservation from "../models/bookReservation";
import RentHistory from "../models/rentHistory";
import Comment from "../models/comment";
import Rating from "../models/rating";

const allowedExtensions: Array<String> = ["jpeg", "jpg", "png"];

export class BookController {
  insertBook = async (req: express.Request, res: express.Response) => {
    const books = await Book.find().sort({ id: -1 }).limit(1);
    let newBookId = 0;
    if (books.length > 0) {
      newBookId = books[0].id + 1;
    }

    let errors: Array<String> = [];

    let book = await Book.findOne({
      name: req.body.name,
      language: req.body.language,
    });
    if (book) {
      errors.push("Knjiga sa istim nazivom na istom jeziku vec postoji u bazi.");
      res.json({ errors: errors });
      return;
    }

    const pic: Express.Multer.File = req.file;
    let picName = "src/uploads/book_defaultPhoto.jpg";

    if (pic != undefined) {
      const arr = pic.mimetype.split("/");
      const extension: string = arr[arr.length - 1];
      const dest = "src/uploads/";
      picName = dest + "book_" + newBookId + "." + extension;
      if (!allowedExtensions.some((e) => e.localeCompare(extension) == 0)) {
        errors.push("Ekstenzija slike mora biti .jpg ili .png.");
        res.json({ errors: errors });
        return;
      }
      fs.writeFileSync(picName, pic.buffer);
    }

    const newBook = new Book({
      id: newBookId,
      name: req.body.name,
      authors: req.body.authors.split(","),
      genre: req.body.genre.split(","),
      publisher: req.body.publisher,
      publishYear: req.body.publishYear,
      language: req.body.language,
      photo: picName,
      userId: parseInt(req.body.userId),
      numberInStock: 1,
      status: req.body.status,
      numberOfTimesTaken: 0,
      isBookOfTheDay: 0,
    });

    newBook
      .save()
      .then(() => {
        res.status(200).json(book);
      })
      .catch(() => {
        res.json({ message: "Error" });
      });
  };

  acceptBook = async (req: express.Request, res: express.Response) => {
    const bookId = req.body.bookId;
    await Book.collection.updateOne({ id: bookId }, { $set: { status: "accepted" } });

    Book.findOne({ id: bookId }, (err: any, book: any) => {
      if (err) {
        res.json({ message: "Error" });
      } else {
        res.status(200).json({ book: book });
      }
    });
  };

  /*updateBookInfo = async (req: express.Request, res: express.Response) => {
    let errors: Array<String> = [];

    // Update without photo
    await Book.collection.updateOne(
      { id: parseInt(req.body.id) },
      {
        $set: {
          name: req.body.name,
          authors: req.body.authors.split(","),
          genre: req.body.genre.split(","),
          publisher: req.body.publisher,
          publishYear: parseInt(req.body.publishYear),
          language: req.body.language,
          numberInStock: req.body.numberInStock,
        },
      }
    );

    const pic: Express.Multer.File = req.file;

    if (pic != undefined) {
      const arr = pic.mimetype.split("/");
      const extension: string = arr[arr.length - 1];
      const dest = "src/uploads/";
      let picName = dest + "book_" + req.body.name + "." + extension;
      if (!allowedExtensions.some((e) => e.localeCompare(extension) == 0)) {
        errors.push("Ekstenzija slike mora biti .jpg ili .png.");
        res.json({ errors: errors });
        return;
      }
      fs.writeFileSync(picName, pic.buffer);

      // If user uploaded new photo, update it
      await Book.collection.updateOne({ id: parseInt(req.body.id) }, { $set: { photo: picName } });
    }

    Book.findOne({ id: parseInt(req.body.id) }, (err: any, book: any) => {
      if (err) {
        errors.push("Doslo je do greske prilikom azuriranja podataka.");
        res.json({ errors: errors });
      } else {
        res.status(200).json({ book: book });
      }
    });
  };
*/
  getAllAcceptedBooksSuggestedByUser = (req: express.Request, res: express.Response) => {
    Book.find({ status: "accepted", userId: req.body.userId }, (err: any, books: any) => {
      if (err) res.json({ status: "Error", books: [], errorMessage: err });
      else res.json({ status: "Ok", books: books });
    });
  };

  getRentedBooksByUser = async (req: express.Request, res: express.Response) => {
    let errors: Array<String> = [];
    const rentedBooksIds = req.body.rentedBooksIds;
    let rentedBooks = [];
    for (let i = 0; i < rentedBooksIds.length; ++i) {
      const book = await Book.findOne({ id: rentedBooksIds[i] });
      if (book) {
        rentedBooks.push(book);
      } else {
        errors.push("Doslo je dogreske prilikom dohvatanja zaduzenih knjiga.");
        break;
      }
    }

    if (errors.length > 0) {
      res.json({ errors: errors });
    } else {
      res.json({ status: "Ok", books: rentedBooks });
    }
  };

  getAllBooks = (req: express.Request, res: express.Response) => {
    Book.find({}, (err: any, books: any) => {
      if (err) res.json({ status: "Error", books: [], errorMessage: err });
      else res.json({ status: "Ok", books: books });
    });
  };

  getAllPendingBooks = (req: express.Request, res: express.Response) => {
    Book.find({ status: "pending" }, (err: any, books: any) => {
      if (err) res.json({ status: "Error", books: [], errorMessage: err });
      else res.json({ status: "Ok", books: books });
    });
  };

  getAllAcceptedBooks = (req: express.Request, res: express.Response) => {
    Book.find({ status: "accepted" }, (err: any, books: any) => {
      if (err) res.json({ status: "Error", books: [], errorMessage: err });
      else res.json({ status: "Ok", books: books });
    });
  };

  getPhoto = (req: express.Request, res: express.Response) => {
    let photoName = req.body.photoName;

    let buffer2: Buffer = fs.readFileSync("./" + photoName);
    res.contentType("image/jpeg");
    res.send(buffer2);
  };

  searchAcceptedBooksByParam = (req: express.Request, res: express.Response) => {
    let name = req.body.name;
    let genres = req.body.genres;
    let yearFrom = req.body.yearFrom;
    let yearTo = req.body.yearTo;
    let publisher = req.body.publisher;
    let author = req.body.author;

    if (genres.length > 0) {
      Book.find(
        {
          status: "accepted",
          name: { $regex: name, $options: "i" },
          genre: { $in: genres },
          publishYear: { $gte: yearFrom, $lte: yearTo },
          publisher: { $regex: publisher, $options: "i" },
          authors: { $regex: author, $options: "i" },
        },
        (err: any, books: any) => {
          if (err) res.json({ status: "Error", books: [], errorMessage: err });
          else res.json({ status: "Ok", books: books });
        }
      );
    } else {
      Book.find(
        {
          status: "accepted",
          name: { $regex: name, $options: "i" },
          publishYear: { $gte: yearFrom, $lte: yearTo },
          //$and:[{publishYear: {$gte: yearFrom}}, {publishYear: {$lte: yearTo}}],
          publisher: { $regex: publisher, $options: "i" },
          authors: { $regex: author, $options: "i" },
        },
        (err: any, books: any) => {
          if (err) res.json({ status: "Error", books: [], errorMessage: err });
          else res.json({ status: "Ok", books: books });
        }
      );
    }
  };

  getTop3Books = (req: express.Request, res: express.Response) => {
    Book.find({ status: "accepted" })
      .sort({ numberOfTimesTaken: -1 })
      .limit(3)
      .exec(function (error, books) {
        if (error) {
          res.json({ message: "Error", books: [], errorMessage: error });
        } else {
          res.json({ message: "Ok", books: books });
        }
      });
  };

  getBookOfTheDay = (req: express.Request, res: express.Response) => {
    Book.find({ status: "accepted", isBookOfTheDay: 1 })
      .limit(1)
      .exec(function (error, books) {
        if (error) {
          res.json({ message: "Error", books: [], errorMessage: error });
        } else {
          res.json({ message: "Ok", books: books });
        }
      });
  };

  getBooksByIdsRepeat = async (req: express.Request, res: express.Response) => {
    const bookIds = req.body.bookIds;
    let booksReturn = [];
    Book.find({ id: { $in: bookIds } }, (err: any, books: any) => {
      if (err) {
        res.json({ message: "Error", books: [], errorMessage: err });
        return;
      }
      for (let i = 0; i < books.length; ++i) {
        for (let j = 0; j < bookIds.length; ++j) {
          if (books[i].id == bookIds[j]) {
            booksReturn.push(books[i]);
          }
        }
      }
      res.json({ message: "Ok", books: booksReturn });
    });
  };

  getBooksByIds = (req: express.Request, res: express.Response) => {
    const bookIds = req.body.bookIds;
    Book.find({ id: { $in: bookIds } }, (err: any, books: any) => {
      if (err) res.json({ message: "Error", books: [], errorMessage: err });
      else res.json({ message: "Ok", books: books });
    });
  };

  public takeBook = (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    const bookId = req.body.bookId;

    Book.updateOne({ id: bookId }, { $inc: { numberInStock: -1 } }, (err: any, resp: any) => {
      // updating book
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      RentLength.findOne({ id: 1 }, (err2: any, rentLen: any) => {
        if (err2) {
          res.json({ message: "Error" });
          return;
        }
        let len = rentLen.length;
        let today: Date = new Date();
        let returnDay: Date = new Date(today.getTime() + len * 24 * 60 * 60 * 1000);

        User.updateOne(
          { id: userId },
          { $push: { rentedBooks: bookId, rentedBooksDateStart: today, rentedBooksDateEnd: returnDay, rentedBooksExtended: false } },
          (err3: any, resp: any) => {
            if (err3) {
              res.json({ message: "Error" });
              return;
            }

            Book.findOne({ id: bookId }, (err4: any, book: any) => {
              if (err4) {
                res.json({ message: "Error" });
                return;
              }

              User.findOne({ id: userId }, (err5: any, user: any) => {
                if (err5) {
                  res.json({ message: "Error" });
                  return;
                }

                res.json({ message: "Ok", user: user, book: book });
              });
            });
          }
        );
      });
    });
  };

  reserveBook = async (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    const bookId = req.body.bookId;

    const reservations = await BookReservation.find().sort({ id: -1 }).limit(1);
    let newReservationId = 0;
    if (reservations.length > 0) {
      newReservationId = reservations[0].id + 1;
    }

    BookReservation.insertMany([{ id: newReservationId, userId: userId, bookId: bookId }])
      .then(() => {
        res.json({ message: "Ok" });
      })
      .catch((error) => {
        res.json({ message: "Error", errorMessage: error });
      });
  };

  deleteBook = async (req: express.Request, res: express.Response) => {
    const id = req.body.id;

    let users = await User.find({ rentedBooks: { $in: [id] } });

    if (!users || users == null) {
      res.json({ message: "Error", errorMessage: "Greska." });
      return;
    }

    if (users.length > 0) {
      res.json({ message: "Error", errorMessage: "Nemoguce obrisati knjigu, postoje korisnici koji su je iznajmili." });
      return;
    }

    await BookReservation.deleteMany({ bookId: id });
    await RentHistory.deleteMany({ bookId: id });
    await Comment.deleteMany({ bookId: id });
    await Rating.deleteMany({ bookId: id });

    Book.deleteOne({ id: id }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error", errorMessage: err });
        return;
      }
      res.json({ message: "Ok" });
    });
  };

  setBookOfTheDay = async (req: express.Request, res: express.Response) => {

    let id = req.body.id;

    let book = await Book.find({id: id})

    if(book && book.length == 1){
      if(book[0].status != "accepted")
        res.json({ message: "Error", errorMessage: "Ne mozemo postaviti neprihvacenu knjigu za knjigu dana." });
        return;
    }

    await Book.updateOne({ isBookOfTheDay: 1 }, { isBookOfTheDay: 0 });

    

    let result = await Book.updateOne({ id: id }, { isBookOfTheDay: 1 });

    if (!result) {
      res.json({ message: "Error", errorMessage: "Greska." });
      return;
    }

    res.json({ message: "Ok" });
  };

  changeBookInfo = async (req: express.Request, res: express.Response) => {
    let bookId = req.body.id;
    let name = req.body.name;
    let authors = req.body.authors.split(",");
    let genre = req.body.genre.split(",");
    let publisher = req.body.publisher;
    let publishYear = parseInt(req.body.publishYear);
    let language = req.body.language;
    let numberInStock = parseInt(req.body.numberInStock);

    let book = await Book.findOne({ id: bookId });
    let oldNumInStock = book.numberInStock;

    let picName = book.photo;
    const pic: Express.Multer.File = req.file;

    let stockTmp = numberInStock; // ovo ce sadrzati konacan broj na stanju (posle dodela rezervacija)

    if (oldNumInStock == 0 && numberInStock > 0) {
      let reservations = await BookReservation.find({ bookId: bookId });

      for (let i = 0; i < reservations.length && stockTmp > 0; i++) {
        let reservation = reservations[i];
        let userId = reservation.userId;

        let user = await User.findOne({ id: userId });

        if (user.status == "blocked") continue;
        if (user.rentedBooks.length < 3) {
          // has not reacheded max
          let bookIndex = user.rentedBooks.findIndex((book) => book == bookId);
          if (bookIndex == -1) {
            // doesnt currently have the book
            let expiredBook = false;
            for (let date of user.rentedBooksDateEnd) {
              if (this.calculateDateDiff(date) < 0) {
                expiredBook = true;
                break;
              }
            }

            if (expiredBook == false) {
              //can take book
              stockTmp--;

              const today = new Date();

              let len = await RentLength.findOne({ id: 1 });

              if (!len) {
                res.json({ message: "Error" });
                return;
              }

              let rentDays: number = len.length;
              let returnDay: Date = new Date(today.getTime() + rentDays * 24 * 60 * 60 * 1000);

              let reservationId = reservation.id;

              await BookReservation.deleteOne({ id: reservationId });

              await User.updateOne(
                { id: userId },
                {
                  $push: {
                    rentedBooks: bookId,
                    rentedBooksDateStart: today,
                    rentedBooksDateEnd: returnDay,
                    rentedBooksExtended: false,
                    reservedBooksAvailable: bookId,
                  },
                }
              );
            }
          }
        }
      }
    }
    if (pic != undefined) {
      let errors = [];
      const arr = pic.mimetype.split("/");
      const extension: string = arr[arr.length - 1];
      const dest = "src/uploads/";
      picName = dest + "book_" + bookId + "." + extension;
      if (!allowedExtensions.some((e) => e.localeCompare(extension) == 0)) {
        errors.push("Ekstenzija slike mora biti .jpg ili .png.");
        res.json({ message: "Error", errorMessage: errors });
        return;
      }
      fs.writeFileSync(picName, pic.buffer);
    }

    await Book.updateOne(
      { id: bookId },
      {
        name: name,
        authors: authors,
        genre: genre,
        publisher: publisher,
        publishYear: publishYear,
        language: language,
        photo: picName,
        numberInStock: stockTmp,
      }
    );

    Book.findOne({ id: bookId }, (err, bookRes) => {
      if (err) {
        res.json({ message: "Error", errorMessage: err });
        return;
      }
      res.json({ message: "Ok", book: bookRes });
    });
  };

  denyBook = async (req: express.Request, res: express.Response) => {
    const bookId = req.body.bookId;
    await Book.collection.updateOne({ id: bookId }, { $set: { status: "rejected" } });

    Book.findOne({ id: bookId }, (err: any, book: any) => {
      if (err) {
        res.json({ message: "Error", errorMessage: err });
      } else {
        res.status(200).json({ message: "Ok", book: book });
      }
    });
  };

  calculateDateDiff = (dateEnd: Date) => {
    const today = new Date();
    dateEnd = new Date(dateEnd);

    return Math.floor(
      (Date.UTC(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  };
}
