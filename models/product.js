const fs = require("fs");
const path = require("path");
const cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static editProductById(id, newProduct, edit) {
    getProductsFromFile((products) => {
      let newProducts = [];
      let prodPrice = 0;
      if (edit) {
        newProducts = products.map((prod) => {
          if (prod.id === id) {
            prodPrice = prod.price;
            return newProduct;
          }
          return prod;
        });
      } else {
        newProducts = products.filter((prod) => {
          if (prod.id === id) prodPrice = prod.price;
          return prod.id != id;
        });
      }

      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        if (!err) {
          cart.deleteProduct(id, prodPrice);
        }
      });
    });
  }
};
