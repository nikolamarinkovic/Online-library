import * as express from "express";
import RentHistory from "../models/rentHistory";

export class RentHistoryController {
  getUserRentHistory = (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    RentHistory.find({ userId: userId }, (err: any, rentHistory: any) => {
      if (err)
        res.json({ message: "Error", rentHistory: [], errorMessage: err });
      else res.json({ message: "Ok", rentHistory: rentHistory });
    });
  };

  addBookToHistory = (req: express.Request, res: express.Response) => {
    const newHistory = new RentHistory(req.body)
    newHistory
      .save()
      .then(() => {
        res.status(200).json({ message: "Ok" });
      })
      .catch(() => {
        res.json({ message: "Error" });
      });
  };
}
