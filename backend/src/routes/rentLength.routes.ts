import express from "express";
import { RentLengthController } from "../controllers/rentLength.controller";

const rentLengthRouter = express.Router();

rentLengthRouter.route("/getRentLength").get((req, res) => {
    new RentLengthController().getRentLength(req, res);
  });

  
rentLengthRouter.route("/setRentLength").post((req, res) => {
  new RentLengthController().setRentLength(req, res);
});

  export default rentLengthRouter;