const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  console.log("aedfAWEF QWEWGFEAG");
  console.log(req.isLoggedIn);

  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  User.findById(req.userId)
    .populate("cart.items.productId")
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      const products = user.cart.items || [];
      console.log(products);
      return res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).render("shop/error", {
        pageTitle: "Error",
        path: "/error",
        message: "An error occurred while retrieving your cart.",
        isLoggedIn: req.isLoggedIn,
        isAdmin: req.isAdmin,
      });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      return User.findById(req.userId)
        .then((user) => {
          console.log(user);
          return user.addToCart(product);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  User.findById(req.userId).then((user) => {
    user
      .removeFromCart(prodId)
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
