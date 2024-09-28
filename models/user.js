const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        const updatedCart = this.cart.items.filter((i) => {
          let ok = false;
          for (let product of products) {
            console.log(i.productId);
            console.log(product._id);
            if (i.productId.toString() === product._id.toString()) ok = true;
          }
          return ok;
        });

        this.cart.items = updatedCart;

        const db = getDb();
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
          )
          .then((d) => {
            console.log("sssssssssssssssss");
            console.log(d);

            return this.cart.items.map((p) => {
              return {
                quantity: p.quantity,
                ...products.find((i) => {
                  return p.productId.toString() === i._id.toString();
                }),
              };
            });
          });
      });
  }

  // ((products) => {
  //   for(let product of products) {

  //   }
  //   return products.map((p) => {
  //     return {
  //       ...p,
  //       quantity: this.cart.items.find((i) => {
  //         return i.productId.toString() === p._id.toString();
  //       }).quantity,
  //     };
  //   });
  // });

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
