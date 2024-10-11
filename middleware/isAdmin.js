const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  req.isAdmin = false;

  if (token) {
    jwt.verify(token, "super secret key", (err, decodedToken) => {
      if (err) {
        console.log(err);
        req.isAdmin = false;
        req.isLoggedIn = false;
        next();
      }
      console.log(req.isLoggedIn);

      req.userId = decodedToken.userId;
      req.isAdmin = decodedToken.userRole === "admin";
      req.isLoggedIn = true;

      next();
    });
  } else {
    next();
  }
};
