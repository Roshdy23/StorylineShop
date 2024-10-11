const path = require("path");

const express = require("express");

const isAuth = require("../middleware/isAuth");

const isAdmin = require('../middleware/isAdmin')

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", isAdmin, shopController.getIndex);

router.get("/products",  isAdmin, shopController.getProducts);

router.get("/products/:productId", isAdmin,  shopController.getProduct);

router.get("/cart",  isAuth, shopController.getCart);

router.post("/cart",  isAuth, shopController.postCart);

router.get('/checkout', isAuth, shopController.getCheckout)

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders",  isAuth, shopController.getOrders);

module.exports = router;
