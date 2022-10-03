import * as express from "express";
import RentLength from "../models/rentLength";

export class RentLengthController {
  getRentLength = (req: express.Request, res: express.Response) => {
    RentLength.find({ id: 1 }, (err: any, rentLength: any) => {
      if (err) res.json({ message: "Error", length: -1, errorMessage: err });
      else res.json({ message: "Ok", length: rentLength[0].length });
    });
  };

  setRentLength = (req: express.Request, res: express.Response) => {
    let newLen = req.body.length;
    RentLength.updateOne({ id: 1 }, { $set: { length: newLen } }, (err: any, rentLength: any) => {
      if (err) res.json({ message: "Error", errorMessage: err });
      else res.json({ message: "Ok" });
    });
  };
}
