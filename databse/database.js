const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://imene:imene9005@cluster0.mx3k5.mongodb.net/shop?tls=true&retryWrites=true&w=majority&appName=Cluster0'  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    }) 
    .catch(err => {
      console.log(err); 
      throw err; 
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
