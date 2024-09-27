const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://roshdy23:7qpZsEZBv9KXJj2C@cluster0.3fhhn.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0",
    {
      ssl: true,  // Ensure SSL is enabled
      tlsAllowInvalidCertificates: true,  // Ensure certificates are valid  
    }
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log('failed')
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
