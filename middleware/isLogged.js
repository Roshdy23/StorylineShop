const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  req.isAdmin = false;

  if (token) {
    jwt.verify(token, "super secret key", (err, decodedToken) => {
      if (err) {
        next();
      }
      res.redirect("/");
      next();
    });
  } else {
    next();
  }
};
