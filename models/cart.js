const getDb = require('../databse/database').getDb;
const mongodb = require('mongodb');

module.exports=class Cart{
    constructor(idUser){
        this.id=idUser
    }
    save(){
        const db=getDb();
        db.collection('cart').insertOne({
      idUser: this.id, // Use the ID of inserted user
      products: [
       
      ],totalPrice:0
    })
    }
    static addToCart(idUser,prodId,title,price,imageUrl){
        const db=getDb();
     return   db.collection('cart').findOne({idUser: new mongodb.ObjectId(idUser)}).then(
       cart=>{
        if (cart.products.length>0) {
           const productInCart = cart.products.find(
    p => p.productId.toString() === prodId.toString());

if (productInCart) {
  productInCart.qty += 1;
} else {
 
  cart.products.push({ productId: new mongodb.ObjectId(prodId),title,price, imageUrl,qty: 1 });
}

            /*function exists(value){
               return value.id==prodId;
            }
            object=cart.products.filter(exsists)
            
            if (object){
                object.qty+=1
            } else cart.products.push({
                productId:prodId,
                qty:1
            })*/
        } else {
            console.log('no products literally')
            cart.products.push({
               productId:new mongodb.ObjectId(prodId),title,price,imageUrl,
                qty:1 
            })
        }
       
        console.log('here are the cartproducts',idUser)  
    const userId = new mongodb.ObjectId(idUser);

        return db.collection('cart').updateOne(
  { idUser: userId },
  {
   $set: {
      products: cart.products
    },
    $inc: {
      totalPrice: price
    }
    
  }
)
    })
        .catch(err=>{
         console.log(err)
        })
    }

static deleteById(idUser,prodId) {
    const db = getDb();
    return db
      .collection('cart')
      .findOne({idUser: new mongodb.ObjectId(idUser)})
      .then(
        cart => {
    const userId = new mongodb.ObjectId(idUser);
console.log('idddd',prodId)

const matchedProducts = cart.products.filter(p => p.productId.toString() !== prodId.toString());
const prod=cart.products.filter(p => p.productId.toString() == prodId.toString())
console.log('idddd',prod[0].price)
      let price=prod[0].price*prod[0].qty 
console.log('Deleted',matchedProducts);
          return db.collection('cart').updateOne(
  { idUser: userId },
  {
    $set: {
      products:matchedProducts
    },
    $inc: {
      totalPrice: -price
    }
  }
)
      })
      .catch(err => {
        console.log(err);
      });
  }
}