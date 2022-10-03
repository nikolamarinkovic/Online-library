import express from "express";
import { RentHistoryController } from "../controllers/rentHistory.controller";

const rentHistoryRouter = express.Router();

rentHistoryRouter.route("/getUserRentHistory").post((req, res) => {
  new RentHistoryController().getUserRentHistory(req, res);
});

rentHistoryRouter.route("/addBookToHistory").post((req, res) => {
  new RentHistoryController().addBookToHistory(req, res);
});

export default rentHistoryRouter;
