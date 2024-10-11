const User = require("../models/user");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.status(200).render("auth/login", {
    pageTitle: "login",
    path: "/login",
    errors: "",
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req).errors;
  let sendErrors = null;

  if (errors.length > 0) {
    return res.status(401).render("auth/login", {
      pageTitle: "login",
      path: "/login",
      errors: errors[0].msg,
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  console.log(password);

  //bcrypt.compare(password, user.password);

  User.findOne({ email: email })

    .then((user) => {
      if (!user) {
        res.status(401).render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errors: "this email doesn't exist",
        });
      }
      console.log(user);

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.status(401).render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errors: "the email and password doesn't match",
        });
      }

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getSignup =(req, res, next) =>{
  res.status(200).render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errors: "",
  });
}

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req).errors;
  let sendErrors = null;

  if (errors.length > 0) {
    return res.status(401).render("auth/signup", {
      pageTitle: "signup",
      path: "/signup",
      errors: errors[0].msg,
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log(password);

  //bcrypt.compare(password, user.password);

  User.findOne({ email: email })

    .then((user) => {
      if (user) {
        res.status(401).render("auth/signup", {
          pageTitle: "signup",
          path: "/signup",
          errors: "this email already exists",
        });
      }
      console.log(user);

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.status(401).render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errors: "the email and password doesn't match",
        });
      }

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
}