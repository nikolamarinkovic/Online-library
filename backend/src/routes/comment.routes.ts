import express from "express";
import { CommentController } from "../controllers/comment.controller";
import { BookGenreController } from "../controllers/bookGenre.controller";

const commentRouter = express.Router();

commentRouter.route("/getCommentsForBook").post((req, res) => {
  new CommentController().getCommentsForBook(req, res);
});

commentRouter.route("/insertComment").post((req, res) => {
  new CommentController().insertComment(req, res);
});

commentRouter.route("/changeComment").post((req, res) => {
  new CommentController().changeComment(req, res);
});




export default commentRouter;
