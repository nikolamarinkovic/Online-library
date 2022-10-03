import * as express from "express";
import RentHistory from "../models/rentHistory";
import Comment from "../models/comment";

export class CommentController {
  getCommentsForBook = (req: express.Request, res: express.Response) => {
    let bookId = req.body.bookId;

    Comment.find({ bookId: bookId })
      .sort({ id: -1 })
      .exec(function (err, comments) {
        if (err) res.json({ message: "Error", comments: [], errorMessage: err });
        else res.json({ message: "Ok", comments: comments });
      });
  };

  insertComment = async (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    let bookId = req.body.bookId;
    let content = req.body.content;
    let date: Date = new Date();
    let rentedBookIds = req.body.rentedBookIds;

    let commentExisting = await Comment.find({ userId: userId, bookId: bookId });

    if (commentExisting.length > 0) {
      res.json({ message: "Error", errorMessage: "Nemoguce dodati komentar, vec imate komentar za tu knjigu " });
      return;
    }

    let found = false;
    for (let rentedBookId of rentedBookIds) {
      if (rentedBookId == bookId) {
        found = true;
        break;
      }
    }

    if (found == false) {
      let bookRented = await RentHistory.find({ userId: userId, bookId: bookId });

      if (bookRented.length == 0) {
        res.json({ message: "Error", errorMessage: "Nemoguce dodati komentar, niste zaduzivali knjigu" });
        return;
      }
    }

    const comments = await Comment.find().sort({ id: -1 }).limit(1);
    let newCommentId = 0;
    if (comments.length > 0) {
      newCommentId = comments[0].id + 1;
    }

    Comment.insertMany([{ id: newCommentId, userId: userId, bookId: bookId, content: content, modified: false, date: date }])
      .then(() => {
        res.json({ message: "Ok" });
      })
      .catch((err) => {
        res.json({ message: "Error", errorMessage: err });
      });
  };

  changeComment = async (req: express.Request, res: express.Response) => {
    let userId = req.body.userId;
    let bookId = req.body.bookId;
    let content = req.body.content;

    let comment = await Comment.find({ userId: userId, bookId: bookId });

    if (comment.length == 0) {
      res.json({ message: "Error", errorMessage: "Komentar ne postoji." });
      return;
    }

    Comment.updateOne({ userId: userId, bookId: bookId }, { content: content, modified: true }, (err: any, resp: any) => {
      if (err) {
        res.json({ message: "Error", errorMessage: err });
        return;
      } else {
        res.json({ message: "Ok" });
        return;
      }
    });
  };
}
