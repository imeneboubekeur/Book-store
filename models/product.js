const getDb = require('../databse/database').getDb;
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl,id,idUser) {
    this.title = title; 
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.idUser=idUser

  }

  save() {
    const db = getDb();
    
     let dbOp;
     if (this._id) {
       console.log('Update the product',this)
       dbOp = db
         .collection('products')
         .updateOne({ _id: this._id }, { $set: this });
    } else {
        console.log('updaaate',this._id)
       dbOp = db.collection('products').insertOne(this);
     }
     return dbOp.catch(err => {
        console.log("error",err);
      });
  }
    /*return db
      .collection('products') 
      .insertOne(this) 
      .then(result => {
        console.log(result);
      })*/
      

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(
        result => {
        console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchByIdUser(userId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ idUser: userId })
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        if (!product) return null;
        //console.log('updaaate1', product._id)
      return new Product(
        product.title,
        product.price,
        product.description,
        product.imageUrl,
        product._id
      );
        
      })
      .catch(err => {
        console.log(err);
      });
  }

}

module.exports = Product;