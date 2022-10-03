import * as express from "express";
import Rating from "../models/rating";

export class RatingController {
  getRatingsByBookId = (req: express.Request, res: express.Response) => {
    const bookId = req.body.bookId;
    Rating.find({ bookId: bookId }, (err: any, ratings: any) => {
      if (err) res.json({ message: "Error", ratings: [], errorMessage: err });
      else res.json({ message: "Ok", ratings: ratings });
    });
  };

  // Inserts rating if does not exist, else update
  insertRating = async (req: express.Request, res: express.Response) => {
    const bookId = req.body.bookId;
    const userId = req.body.bookId;
    const newRating = req.body.rating;
    const rating = await Rating.findOne({ bookId: bookId, userId: userId });

    if (rating != null && rating != undefined) {
      Rating.updateOne({ bookId: bookId, userId: userId }, { rating: newRating }, (err: any, ratings: any) => {
        if (err) res.json({ message: "Error" });
        else res.json({ message: "Ok" });
      });
    } else {
      Rating.insertMany([{ bookId: bookId, userId: userId, rating: newRating }])
        .then(() => {
          res.json({ message: "Ok" });
        })
        .catch((error) => {
          res.json({ message: "Error"});
        });
    }
  };

  getNumberOfRatingsForBook = (req: express.Request, res: express.Response) => {

    let bookId = req.body.bookId;

    Rating.count({bookId: bookId}, (err: any, cnt: any)=>{
      if(err){
        res.json({ message: "Error" });
        return;
      }

      res.json({ message: "Ok" , count: cnt});
    })

  }
}
