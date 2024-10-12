const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const stripe = require("stripe")(
  "your stripe secret key"
);
const ITEMS_PER_PAGE = 3;
exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Home",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      return res.status(500).render("500", {
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

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  User.findById(req.userId)
    .populate("cart.items.productId")
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      products = user.cart.items || [];
      console.log(products);

      products.forEach((p) => {
        total += p.productId.price * p.quantity;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
              unit_amount: p.productId.price * 100, // Amount in cents
            },
            quantity: p.quantity,
          };
        }),
        mode: "payment",
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        isAdmin: req.isAdmin,
        isLoggedIn: req.isLoggedIn,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).render("500", {
        pageTitle: "Error",
        path: "/error",
        message: "An error occurred while retrieving your cart.",
        isLoggedIn: req.isLoggedIn,
        isAdmin: req.isAdmin,
      });
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  User.findById(req.userId)
    .populate("cart.items.productId")
    .then((user) => {
      getUser = user;
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: user.email,
          userId: req.userId,
        },
        products: products,
      });
      order
        .save()

        .then((result) => {
          return user.clearCart();
        });
    })

    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      Order.find({ "user.userId": user._id }).then((orders) => {
        res.render("shop/orders", {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
          isAdmin: req.isAdmin,
          isLoggedIn: req.isLoggedIn,
        });
      });
    })
    .catch((err) => console.log(err));
};
