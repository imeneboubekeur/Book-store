const getDb = require('../databse/database').getDb;
const mongodb = require('mongodb');
/*{
      book: {
        _id: this.bookId,
        title: this.title,
        price: price,
       
      },
      quantity: quantity
    }*/
module.exports=class Order{
    constructor(userId){
        this.userId=userId
        /*this.bookId=bookId
        this.title=title
        this.price=price
        this.quantity=quantity*/
    }
    save(){
     const db=getDb();
     
         return db.collection('order').insertOne(
            {userId:this.userId,
            items: [  
     
  ],
        }
         ).catch(err=>{
                console.error('Error:', err);

         })
}
static addToOrders(idUser,prodId,quantity){
          const db=getDb();
  return   db.collection('order').findOne({userId: new mongodb.ObjectId(idUser)}).then(
         order=>{    console.log("order2",order)
 
 return db.collection('products').findOne({_id:new mongodb.ObjectId(prodId)}).then(product=>{
    console.log("order2",order) 
     order.items.push({book:{ _id:new mongodb.ObjectId(prodId) ,
        title: product.title,
        price: product.price},
      quantity: quantity})
      return db.collection('order').updateOne(
  { userId: idUser },
  {
    $set: {
      items:order.items
    }
  } 
)
})
         })
}






}

