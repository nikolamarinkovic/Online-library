import * as express from "express";
import fs from "fs";
import BookReservation from "../models/bookReservation";
import Book from "../models/book";
import User from "../models/user";
import RentLength from "../models/rentLength";
import RentHistory from "../models/rentHistory";
import Comment from "../models/comment";
import Rating from "../models/rating";

const allowedExtensions: Array<String> = ["jpeg", "jpg", "png"];

export class UserController {
  getAllUsers = (req: express.Request, res: express.Response) => {
    User.find({}, (err: any, users: any) => {
      if (err) res.json({ message: "Error", errorMessage: err, users: [] });
      else res.json({ message: "Ok", users: users });
    });
  };

  clearReservedBooksAvailable = async (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    await User.updateOne({ id: userId }, { $set: { reservedBooksAvailable: [] } });

    User.findOne({ id: userId }, (err: any, user: any) => {
      if (err) {
        res.json({ message: "Error" });
      } else {
        res.json({ user: user });
      }
    });
  };

  extendBookReturnDeadline = (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    const bookIndex = req.body.bookIndex;
    User.findOne({ id: userId }, async (err: any, user: any) => {
      if (err) {
        res.json({ message: "Error while extending return deadline." });
      } else {
        const dateEnd = user.rentedBooksDateEnd[bookIndex];
        const daysToAdd = await RentLength.findOne({ id: 1 });

        user.rentedBooksDateEnd[bookIndex].setDate(dateEnd.getDate() + daysToAdd.length);
        user.rentedBooksExtended[bookIndex] = true;

        await User.updateOne({ id: userId }, { $set: { rentedBooksDateEnd: user.rentedBooksDateEnd, rentedBooksExtended: user.rentedBooksExtended } });

        User.findOne({ id: userId }, (err: any, user: any) => {
          if (err) {
            res.json({ message: "Error" });
          } else {
            res.json({ user: user });
          }
        });
      }
    });
  };

  getUserById = (req: express.Request, res: express.Response) => {
    let id = req.body.id;

    User.findOne({ id: id }, (err: any, user: any) => {
      if (err) {
        res.json({ message: "Error", errorMessage: "Greska, ne postoji korisnik u bazi" });
      } else {
        res.json({ message: "Ok", user: user });
      }
    });
  };

  getUsernameById = async (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    User.findOne({ id: userId }, (err: any, user: any) => {
      if (err) {
        res.json({ message: "Error while fetching username by id." });
      } else {
        res.json({ username: user.username });
      }
    });
  };

  returnBook = async (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    const bookIndexReq = req.body.bookIndex;
    const bookIdReq = req.body.bookId;
    let user = await User.findOne({ id: userId });

    if (!user) {
      res.json({ message: "Error" });
      return;
    }
    user.rentedBooks.splice(bookIndexReq, 1);
    user.rentedBooksDateStart.splice(bookIndexReq, 1);
    user.rentedBooksDateEnd.splice(bookIndexReq, 1);
    user.rentedBooksExtended.splice(bookIndexReq, 1);

    await User.collection.updateOne(
      //sklonili iz niza
      { id: userId },
      {
        $set: {
          rentedBooks: user.rentedBooks,
          rentedBooksDateStart: user.rentedBooksDateStart,
          rentedBooksDateEnd: user.rentedBooksDateEnd,
          rentedBooksExtended: user.rentedBooksExtended,
        },
      }
    );

    let bookGivenToReservation: boolean = false;
    let reservations = await BookReservation.find({ bookId: bookIdReq }).sort({ id: 1 });

    if (!reservations) {
      res.json({ message: "Error" });
      return;
    }

    let reservationIndex = -1;
    for (let i = 0; i < reservations.length && bookGivenToReservation == false; i++) {
      let reservation = reservations[i];
      const resUserId = reservation.userId;
      const resBookId = reservation.bookId;

      let usr = await User.findOne({ id: resUserId });

      if (!usr) {
        res.json({ message: "Error" });
        return;
      }

      if (usr.status == "blocked") 
         continue;
      if (usr.rentedBooks.length < 3) {
        // has not reacheded max
        let bookIndex = usr.rentedBooks.findIndex((book) => book == resBookId);
        if (bookIndex == -1) {
          // doesnt currently have the book
          let expiredBook = false;
          for (let date of usr.rentedBooksDateEnd) {
            if (this.calculateDateDiff(date) < 0) {
              expiredBook = true;
              break;
            }
          }

          if (expiredBook == false) {
            bookGivenToReservation = true;
            reservationIndex = i;
          }
        }
      }
    }

    let user3 = await User.findOne({ id: userId });

    if (!user3) {
      res.json({ message: "Error" });
      return;
    }

    if (bookGivenToReservation == true) {
      let reservation = reservations[reservationIndex];

      const userId = reservation.userId;
      const bookId = reservation.bookId;
      const today = new Date();

      let len = await RentLength.findOne({ id: 1 });

      if (!len) {
        res.json({ message: "Error" });
        return;
      }

      let rentDays = len.length;
      let returnDay = new Date(today.getTime() + rentDays * 24 * 60 * 60 * 1000);

      let reservationId = reservation.id;

      await BookReservation.deleteOne({ id: reservationId });

      User.updateOne(
        { id: userId },
        {
          $push: {
            rentedBooks: bookId,
            rentedBooksDateStart: today,
            rentedBooksDateEnd: returnDay,
            rentedBooksExtended: false,
            reservedBooksAvailable: bookIdReq,
          },
        },
        (err3: any, resp: any) => {
          if (err3) {
            res.json({ message: "Error" });
            return;
          }

          res.status(200).json({ message: "Ok", user: user3 });
        }
      );
    } else {
      Book.updateOne({ id: bookIdReq }, { $inc: { numberInStock: 1 } }, (err: any, book: any) => {
        if (err) {
          res.json({ message: "Error" });
          return;
        }

        res.status(200).json({ message: "Ok", user: user3 });
      });
    }
  };

  getPhoto = (req: express.Request, res: express.Response) => {
    let photoName = req.body.photoName;

    let buffer2: Buffer = fs.readFileSync("./" + photoName);

    res.contentType("image/jpeg");
    res.send(buffer2);
  };

  login = (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const password = req.body.password;
    let errors: Array<String> = [];

    let isAdmin: boolean = req.body.type == "admin";

    User.findOne({ username: username, password: password }, (err: any, user: any) => {

      let userLoginAsAdmin = !isAdmin && user && user != null && user.type == "admin";
      let adminLoginAsUser = isAdmin && user && user != null && user.type != "admin";

      if (err || user == null || !user) {
        errors.push("Pogresni podaci.");
        res.json({ errors: errors });
      } else if (user && user != null && (userLoginAsAdmin || adminLoginAsUser)) {
        if (isAdmin) {
          errors.push("Korisnik mora biti tipa admin.");
        } else {
          errors.push("Pogresni podaci.");
          return;
        }
        res.json({ errors: errors });
      } else {
        if (user.status == "pending") {
          errors.push("Admin nije odobrio profil.");
          res.json({ errors: errors });
          return;
        }
        if(user.status == "rejected"){
          errors.push("Admin je odbio profil.");
          res.json({ errors: errors });
          return;
        }
        res.status(200).json({ user: user });
      }
    });
  };

  register = async (req: express.Request, res: express.Response) => {
    const newUsername = req.body.username;
    const newEmail = req.body.email;

    const users = await User.find().sort({ id: -1 }).limit(1);
    let newUserId = 0;
    if (users.length > 0) {
      newUserId = users[0].id + 1;
    }

    let errors: Array<String> = [];

    User.findOne({ username: newUsername }, (err: any, user: any) => {
      if (user) {
        errors.push("Korisnicko ime mora biti jedinstveno.");
        res.json({ errors: errors });
        return;
      }
      User.findOne({ email: newEmail }, (err: any, user: any) => {
        if (user) {
          errors.push("Email adresa mora biti jedinstvena.");
          res.json({ errors: errors });
          return;
        }

        const pic: Express.Multer.File = req.file;
        let picName = "src/uploads/user_defaultPhoto.jpg";

        if (pic != undefined) {
          const arr = pic.mimetype.split("/");
          const extension: string = arr[arr.length - 1];
          const dest = "src/uploads/";
          picName = dest + "user_" + newUserId + "." + extension;
          if (!allowedExtensions.some((e) => e.localeCompare(extension) == 0)) {
            errors.push("Ekstenzija slike mora biti .jpg ili .png.");
            res.json({ errors: errors });
            return;
          }
          fs.writeFileSync(picName, pic.buffer);
        }

        const newUser = new User({
          id: newUserId,
          username: req.body.username,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          photo: picName,
          rentedBooks: [],
          rentedBooksDateStart: [],
          rentedBooksDateEnd: [],
          rentedBooksExtended: [],
          rentendBooksAvailable: [],
          type: req.body.type,
          status: req.body.status,
        });

        newUser
          .save()
          .then(() => {
            res.status(200).json(user);
          })
          .catch(() => {
            res.json({ message: "Error" });
          });
      });
    });
  };

  updateUserInfo = async (req: express.Request, res: express.Response) => {
    const userId = parseInt(req.body.userId);
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const oldUsername = req.body.oldUsername;
    const oldEmail = req.body.oldEmail;

    let errors: Array<String> = [];

    if (newUsername != oldUsername) {
      let user = await User.findOne({ username: newUsername });
      if (user) {
        errors.push("Korisnicko ime mora biti jedinstveno.");
        res.json({ errors: errors });
        return;
      }
    }

    if (newEmail != oldEmail) {
      let user = await User.findOne({ email: newEmail });
      if (user) {
        errors.push("Email adresa mora biti jedinstvena.");
        res.json({ errors: errors });
        return;
      }
    }

    // Update without photo
    await User.collection.updateOne(
      { id: userId },
      {
        $set: {
          username: newUsername,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          address: req.body.address,
          phone: req.body.phone,
          email: newEmail,
        },
      }
    );

    if (req.body.newPassword != "") {
      User.collection.updateOne({ id: userId }, { $set: { password: req.body.newPassword } });
    }

    const pic: Express.Multer.File = req.file;

    if (pic != undefined) {
      const arr = pic.mimetype.split("/");
      const extension: string = arr[arr.length - 1];
      const dest = "src/uploads/";
      let picName = dest + "user_" + userId + "." + extension;
      if (!allowedExtensions.some((e) => e.localeCompare(extension) == 0)) {
        errors.push("Ekstenzija slike mora biti .jpg ili .png.");
        res.json({ errors: errors });
        return;
      }
      fs.writeFileSync(picName, pic.buffer);

      // If user uploaded new photo, update it
      await User.collection.updateOne({ id: userId }, { $set: { photo: picName } });
    }

    User.findOne({ id: userId }, (err: any, user: any) => {
      if (err || user == null || !user) {
        errors.push("Doslo je do greske prilikom azuriranja podataka.");
        res.json({ errors: errors });
      } else {
        res.status(200).json({ user: user });
      }
    });
  };

  getUserReservations = (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;

    BookReservation.find({ userId: userId }, (err: any, reservations: any) => {
      if (err) {
        res.json({ message: "Error", reservations: [], errorMessage: err });
        return;
      }

      res.json({ message: "Ok", reservations: reservations });
      return;
    });
  };

  upgradeReaderToModerator = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, type: "reader" }, { type: "moderator" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  downgradeModeratorToReader = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, type: "moderator" }, { type: "reader" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  blockUser = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, status: "accepted" }, { status: "blocked" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  unblockUser = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, status: "blocked" }, { status: "accepted" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  acceptUser = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, status: "pending" }, { status: "accepted" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  rejectUser = (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    User.updateOne({ id: userId, status: "pending" }, { status: "rejected" }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" });
      return;
    });
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;

    let user = await User.findOne({ id: userId });

    if (!user || user == null) {
      res.json({ message: "Error", errorMessage: "Neocekivana greska." });
      return;
    }

    if (user.rentedBooks.length > 0) {
      res.json({ message: "Error", errorMessage: "Korisnik ima knjige koje drzi" });
      return;
    }

    await BookReservation.deleteMany({ userId: userId });
    await RentHistory.deleteMany({ userId: userId });
    await Comment.deleteMany({ userId: userId });
    await Rating.deleteMany({ userId: userId });

    User.deleteOne({ id: userId }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error", errorMessage: "Neocekivana greska." });
        return;
      }

      res.json({ message: "Ok" });
      return;
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
