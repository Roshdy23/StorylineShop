const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const user = require("../models/user");

const createToken = (id, role) => {
  return jwt.sign({ userId: id, userRole: role }, "super secret key", {
    expiresIn: "1h",
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("auth/login", {
    pageTitle: "login",
    path: "/login",
    errors: "",
    isAdmin: false,
    isLoggedIn: false,
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
      isAdmin: false,
      isLoggedIn: false,
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  console.log(password);

  //bcrypt.compare(password, user.password);

  let currentUser;

  User.findOne({ email: email })

    .then((user) => {
      if (!user) {
        res.status(401).render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errors: "this email doesn't exist",
          isAdmin: false,
          isLoggedIn: false,
        });
      }
      currentUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.status(401).render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errors: "the email and password doesn't match",
          isAdmin: false,
          isLoggedIn: false,
        });
      }

      let token;

      if (currentUser.isAdmin) {
        token = createToken(currentUser._id, "admin");
      } else {
        token = createToken(currentUser._id, "user");
      }

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  res.status(200).render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errors: "",
    isAdmin: false,
    isLoggedIn: false,
  });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req).errors;

  if (errors.length > 0) {
    return res.status(401).render("auth/signup", {
      pageTitle: "signup",
      path: "/signup",
      errors: errors[0].msg,
      isAdmin: false,
      isLoggedIn: false,
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const adminSecretKey = req.body.isAdmin;

  User.findOne({ email: email })

    .then((user) => {
      if (user) {
        return res.status(401).render("auth/signup", {
          pageTitle: "signup",
          path: "/signup",
          errors: "this email already exists",
          isAdmin: false,
          isLoggedIn: false,
        });
      }
      console.log(user);

      if (password !== confirmPassword) {
        return res.status(401).render("auth/signup", {
          pageTitle: "signup",
          path: "/signup",
          errors: "The passwords doesn't match",
          isAdmin: false,
          isLoggedIn: false,
        });
      }

      let isAdmin = adminSecretKey === "adminKey";

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
          isAdmin: isAdmin,
        });

        return user.save();
      });
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
