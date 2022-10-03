import express from "express";
import { RatingController } from "../controllers/rating.controller";

const ratingRouter = express.Router();

ratingRouter.route("/getRatingsByBookId").post((req, res) => {
  new RatingController().getRatingsByBookId(req, res);
});

ratingRouter.route("/insertRating").post((req, res) => {
    new RatingController().insertRating(req, res);
});

ratingRouter.route("/getNumberOfRatingsForBook").post((req, res) => {
  new RatingController().getNumberOfRatingsForBook(req, res);
});



export default ratingRouter;
