const getDb = require('../databse/database').getDb;
const mongodb = require('mongodb');
const Product = require('./product');

module.exports= class User {
  constructor (email,password,id,role){
    this.email=email;
    this.password=password;
    this._id=id;
    this.role="buyer"
  }
  save(){
    //,cart :{products:[], totalPrice: 0} };
    console.log(this.email)
    let id=this._id
    let user = { email:this.email, password:this.password,role:this.role  };
    const db=getDb();
   return db.collection('user')
  .insertOne(user)
  .catch(err => {
    console.error('Error:', err);
  });

  }
     addProduct(id,productPrice,idUser){
        const db=getDb();
        db
        .collection('user')
        .findOne({_id:idUser}).then(product => {
          /*let idd;
           db.collection('cart').findOne({}).then(result=>{console.log('here it is',result._id);
              idd=result._id;*/
          console.log("9iiiw",product);
          let existingProductIndex=-1;
          let existingProduct=-1;
          //let user = { cart :{products:[], totalPrice: 0} };
          let cart={products:[], totalPrice: 0};
          //console.log('the product retrieved :', product.length)
          //if (!product.length==0 )
          {console.log("caart",product.cart);
            //Cart =product[0].cart;
            cart=product.cart;
          
          console.log(cart.products.length)
          if (!cart.products.length==0)
            {//console.log('available',id);
                //console.log(cart.products);
            existingProductIndex = cart.products.findIndex(
                //prod._id === id
                prod =>  prod.id.equals(id) 
              );}
              console.log(existingProductIndex);
              if (!(existingProductIndex==-1))
              { 
                console.log('same id');
                existingProduct = cart.products[existingProductIndex];
              }
              console.log(existingProduct);
              let updatedProduct;
              // Add new product or increase quantity
              if (!(existingProduct==-1)) { 
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
              } else {
                updatedProduct = { id: id, qty: 1 };
               cart.products = [...cart.products, updatedProduct];
              }
         
              // Update total price
              cart.totalPrice = cart.totalPrice + +productPrice;
        // save the cart in the cart collection of the database
       // console.log(cart); 
            }
        if (product.length==0){
            console.log('no available yet');
            db.collection('user').insertOne(cart);
        }
        let idd;
        db.collection('user')
          .findOne({_id:idUser})
          .then(result => {
            if (!result) {
              throw new Error('No document found!');
            }
        
            console.log('Here it is:', result._id);
            idd = result._id;
        
            // Ensure replaceOne runs after findOne is done
            return db.collection('user').updateOne({ _id: idUser}, {$set:{cart:cart}});
          })
          .then(result => { 
            console.log('Replace result:', result);
          })
          .catch(err => console.error('Error:', err));
             })}
    static findById(prodId) {
        const db = getDb();
        return db
          .collection('user')
          .find({ _id: new mongodb.ObjectId(prodId) })
          .next()
          .then(product => {
            console.log(product);
            return product;
          })
          .catch(err => {
            console.log(err);
          });
        } 
        static test(){
          return "hello from testing"
        }

        static deleteProductCart(prodId){
    const db=getDb();
    return
}
}

