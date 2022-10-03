import express from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = express.Router();

const regexFirstCapital = new RegExp("^[A-Z].*$");
const regexFirstLetter = new RegExp("^[A-Za-z].*$");
const regexCharacterNum = new RegExp(".{8,12}");
const regexDigit = new RegExp("^.*[0-9].*$");
const regexCapitalLetter = new RegExp("^.*[A-Z].*$");
const regexSpecialCharacter = new RegExp("^.*[!@#$%^\.&*].*$");

userRouter.route("/extendBookReturnDeadline").post((req, res) => {
  new UserController().extendBookReturnDeadline(req, res);
});

userRouter.route("/clearReservedBooksAvailable").post((req, res) => {
  new UserController().clearReservedBooksAvailable(req, res);
});

userRouter.route("/getUsernameById").post((req, res) => {
  new UserController().getUsernameById(req, res);
});

userRouter.route("/getUserById").post((req, res) => {
  new UserController().getUserById(req, res);
});

userRouter.route("/returnBook").post((req, res) => {
  new UserController().returnBook(req, res);
});

userRouter.route("/getAllUsers").get((req, res) => {
  new UserController().getAllUsers(req, res);
});

userRouter.route("/login").post((req, res) => {
  req.checkBody("username", "Korisnicko ime mora biti popunjeno.").notEmpty();
  req.checkBody("password", "Lozinka mora biti popunjena.").notEmpty();

  req.getValidationResult().then((result) => {
    let errors = [];
    result.array().forEach((result) => {
      errors.push(result.msg);
    });

    if (errors.length > 0) return res.json({ errors: errors });

    new UserController().login(req, res);
  });
});

userRouter.route("/getPhoto").post((req, res) => {
  new UserController().getPhoto(req, res);
});

userRouter.route("/updateUserInfo").post((req, res) => {
  req.checkBody("username", "Korisnicko ime mora biti popunjeno.").notEmpty();
  req.checkBody("firstname", "Ime mora biti popunjeno.").notEmpty();
  req.checkBody("lastname", "Prezime mora biti popunjeno.").notEmpty();
  req.checkBody("address", "Adresa mora biti popunjena.").notEmpty();
  req.checkBody("phone", "Broj telefona mora biti popunjen.").notEmpty();
  req.checkBody("email", "Email mora biti popunjen.").notEmpty();
  req.checkBody("email", "Email mora biti u ispravnom formatu.").isEmail();

  req.getValidationResult().then((result) => {
    let errors = [];
    result.array().forEach((result) => {
      errors.push(result.msg);
    });

    if (req.body.confirmOldPassword != "" || req.body.newPassword || req.body.confirmNewPassword != "") {
      if (!(req.body.oldPassword === req.body.confirmOldPassword)) errors.push("Stara lozinka nije tacna.");
      if (!(req.body.newPassword === req.body.confirmNewPassword)) errors.push("Nove lozinke se ne poklapaju.");
      if (!regexFirstCapital.test(req.body.firstname)) errors.push("Ime mora pocinjati velikim slovom.");
      if (!regexFirstCapital.test(req.body.lastname)) errors.push("Prezime mora pocinjati velikim slovom.");
      if (!regexFirstLetter.test(req.body.newPassword)) errors.push("Lozinka mora poceti slovom.");
      if (!regexCharacterNum.test(req.body.newPassword)) errors.push("Lozinka mora imati minimalno 8 znakova.");
      if (!regexDigit.test(req.body.newPassword)) errors.push("Lozinka mora sadrzati bar jednu cifru.");
      if (!regexCapitalLetter.test(req.body.newPassword)) errors.push("Lozinka mora sadrzati bar jedno veliko slovo.");
      if (!regexSpecialCharacter.test(req.body.newPassword)) errors.push("Lozinka mora sadrzati bar jedan specijalan znak.");
    }

    if (errors.length > 0) return res.json({ errors: errors });

    new UserController().updateUserInfo(req, res);
  });
});

userRouter.route("/register").post((req, res) => {
  req.checkBody("username", "Korisnicko ime mora biti popunjeno.").notEmpty();
  req.checkBody("password", "Lozinka mora biti popunjena.").notEmpty();
  req.checkBody("confirmPassword", "Morate potvrditi lozinku.").notEmpty();
  req.checkBody("firstname", "Ime mora biti popunjeno.").notEmpty();
  req.checkBody("lastname", "Prezime mora biti popunjeno.").notEmpty();
  req.checkBody("address", "Adresa mora biti popunjena.").notEmpty();
  req.checkBody("phone", "Broj telefona mora biti popunjen.").notEmpty();
  req.checkBody("email", "Email mora biti popunjen.").notEmpty();
  req.checkBody("email", "Email mora biti u ispravnom formatu.").isEmail();
  req.checkBody("type", "Tip mora biti popunjen.").notEmpty();

  req.getValidationResult().then((result) => {
    let errors = [];
    result.array().forEach((result) => {
      errors.push(result.msg);
    });

    if (req.body.type != "reader" && req.body.type != "moderator") errors.push("Tip mora biti u ispravnom formatu.");
    if (!(req.body.password === req.body.confirmPassword)) errors.push("Lozinke se ne poklapaju.");
    if (!regexFirstCapital.test(req.body.firstname)) errors.push("Ime mora pocinjati velikim slovom.");
    if (!regexFirstCapital.test(req.body.lastname)) errors.push("Prezime mora pocinjati velikim slovom.");
    if (!regexFirstLetter.test(req.body.password)) errors.push("Lozinka mora poceti slovom.");
    if (!regexCharacterNum.test(req.body.password)) errors.push("Lozinka mora imati minimalno 8 znakova.");
    if (!regexDigit.test(req.body.password)) errors.push("Lozinka mora sadrzati bar jednu cifru.");
    if (!regexCapitalLetter.test(req.body.password)) errors.push("Lozinka mora sadrzati bar jedno veliko slovo.");
    if (!regexSpecialCharacter.test(req.body.password)) errors.push("Lozinka mora sadrzati bar jedan specijalan znak.");

    if (errors.length > 0) return res.json({ errors: errors });

    new UserController().register(req, res);
  });
});

userRouter.route("/getUserReservations").post((req, res) => {
  new UserController().getUserReservations(req, res);
});

userRouter.route("/upgradeReaderToModerator").post((req, res) => {
  new UserController().upgradeReaderToModerator(req, res);
});

userRouter.route("/downgradeModeratorToReader").post((req, res) => {
  new UserController().downgradeModeratorToReader(req, res);
});

userRouter.route("/blockUser").post((req, res) => {
  new UserController().blockUser(req, res);
});

userRouter.route("/unblockUser").post((req, res) => {
  new UserController().unblockUser(req, res);
});

userRouter.route("/acceptUser").post((req, res) => {
  new UserController().acceptUser(req, res);
});

userRouter.route("/deleteUser").post((req, res) => {
  new UserController().deleteUser(req, res);
});

userRouter.route("/rejectUser").post((req, res) => {
  new UserController().rejectUser(req, res);
});

export default userRouter;
