# StorylineShop
StorylineShop is an e-commerce platform for selling books online.

## Built With
[![Node][Node.js]][Node-url] [![Express][Express.js]][Express-url] [![MongoDB][MongoDB]][MongoDB-url] [![Mongoose][Mongoose]][Mongoose-url]

## Demo Video
https://github.com/user-attachments/assets/6468da20-a794-451a-931f-1192b40394f2
## Features

-  Secure JWT-based authentication with role-based access control (admin, user) and hash encryption of users passwords.
- Manage books (title, author, price, etc.), with efficient pagination and filtering options in the admin mode.
- Users can add books to the cart, place orders, and track order statuses.
- Secure online payments using Stripe, with transaction history and receipts.
- Organized codebase using the MVC design pattern with a complex data model for users, products, carts, and orders.




## How to Run
- Install the used dependencies.
- Make account on MongoDB Atlas and create a cluster.
- Copy your connection string and put it here.
  
 ```
  mongoose
  .connect(
    "your connection string"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
```
- Make account on stripe and copy your secret api key and put it here in the shop.js.
  
```
  const stripe = require("stripe")(
   "your secret api key on stripe"
  );
```
- Copy your public api key and put it here in the checkout.ejs view.

  ``` 
   orderBtn.addEventListener('click', function() {
  stripe.redirectToCheckout({
   sessionId: '<%= sessionId %>'
     })
   });
  ```
- Finally run npm start and start the project.
        






[Node.js]: https://img.shields.io/badge/NODE.js-rgb(50,120,50)?style=for-the-badge&logo=node.js
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/express.js-grey?style=for-the-badge&logo=express
[Express-url]: https://expressjs.org/
[MongoDB]: https://img.shields.io/badge/mongodb-rgb(0,30,80)?style=for-the-badge&logo=mongoDB
[MongoDB-url]: https://mongodb.org/
[Mongoose]: https://img.shields.io/badge/mogoose.js-rgb(136,0,0)?style=for-the-badge&logo=mongoose
[Mongoose-url]: https://mongoosejs.com
