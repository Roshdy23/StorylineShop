const express = require("express");

const { check, validationResult } = require("express-validator");

const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),

    check("email", "Please enter a valid email").isEmail(),

    check("password", "Password is required").not().isEmpty(),
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email", "Email is required").not().isEmpty(),

    check("email", "Please enter a valid email").isEmail(),

    check("password", "Password is required").not().isEmpty(),

    check("password", "the password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  authController.postSignup
);

module.exports = router;
