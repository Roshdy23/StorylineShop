const path = require("path");

const express = require("express");

const isAuth = require("../middleware/isAuth");
const isAuthorized = require("../middleware/isAutherized");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, isAuthorized, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, isAuthorized, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  isAuthorized,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuth,
  isAuthorized,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  isAuth,
  isAuthorized,
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  isAuth,
  isAuthorized,
  adminController.postDeleteProduct
);

module.exports = router;
