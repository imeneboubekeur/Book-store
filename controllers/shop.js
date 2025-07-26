const Product=require('../models/product')
//const Cart=require('./cartd');
const User=require('../models/user');
const Cart=require('../models/cart')
const Order=require('../models/order')
const mongodb = require('mongodb');
const getDb = require('../databse/database').getDb;
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//const path = require('path');
//const fs = require('fs');
//const PDFDocument = require('pdfkit');




exports.getProducts = (req, res, next) => {
  /*Product.fetchAll()
    .then(products => {
      res.render('products', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });*/
    const db = getDb();

    // 1. Get page and perPage from query string
  let page = parseInt(req.query.page) || 1;
  let perPage = parseInt(req.query.perPage) || 5;
  let  totalPages
  let pages
    db.collection('products').countDocuments().then (totalUsers=>{   
      pages=totalUsers
      totalPages = Math.ceil(totalUsers / perPage);
      console.log('total pages',totalPages)

  // 2. Calculate skip value
  let skip = (page - 1) * perPage;

  // 3. Fetch users from database (example with MongoDB)
   return db.collection('products')
    .find({})
    .skip(skip)
    .limit(perPage)
    .toArray().then(products=>{
       const start = (page - 1) * perPage + 1;
      const end = Math.min(start + products.length - 1, totalUsers);
      res.render('products', {
    prods:products,
    page,
    perPage,
    totalPages,pages,totalUsers,
     startItem: start,
        endItem: end
  });}).catch(err=>{
          console.error('Error fetching products:', err);

      res.status(400).json( 
        { status:'fails',message: 'database error!' });
  })
})


  // 4. Render the EJS template
  
};

exports.signleProduct=(req,res,next)=>{
prodId=req.params.prodId;
const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        if (!product) return null;
         // your MongoDB connection


db.collection('products')
  .find({ _id: { $ne: new mongodb.ObjectId(prodId) } })
  .toArray()
  .then(products => {
     res.render('singleProduct', {
      product:product,
        products:products,
        pageTitle: 'All Products',
       
      });
  })
  .catch(err=>{
          console.error( err);

      res.status(500).json( 
        { status:'fails',message: 'database error!' });
  })

        //console.log('updaaate1', product._id)
    
        
      })
      .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'database error!' });
      });
}

exports.getCart=(req,res,next)=>{
  if (req.session.user.role !== 'buyer') {
    return res.status(403).render('403');
  }
  const db=getDb();
  db.collection('cart').findOne({idUser:req.user._id}).then(cart=>{
       console.log('problem',req.user._id)
    const products=cart.products; 
    res.render('cart', {
      cart:cart,
      pageTitle: 'CART', 
      path: '/cart',
      products:products,
      
      isAuthenticated: req.session.isLoggedIn
    });
    
   
   
  }) .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'database error!' });
      });
}

/*exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('hey');
 let product=Product.findById(new mongodb.ObjectId(prodId));
    Cart.addProduct(new mongodb.ObjectId(prodId), product.price);
  ;
  res.redirect('/cart');  
};*/


exports.postCart = async (req, res, next) => {

 try {
    const prodId = req.body.productId;

    // Validate ObjectId
    if (!mongodb.ObjectId.isValid(prodId)) {
      console.error('Invalid ObjectId:', prodId);
      return res.status(400).send('Invalid Product ID');
    }

    // Fetch product from database (wait for result)
    const product = await Product.findById(new mongodb.ObjectId(prodId));

    if (!product) {
      console.error('Product not found for ID:', prodId);
      return res.status(404).send('Product not found');
    }

     
     if (!req.user) {
      console.error("req.user is undefined");
      return res.redirect('/');
    }
    console.log('the id of your current session is:',req.user._id)
    await req.user.addProduct(new mongodb.ObjectId(prodId), product.price,new mongodb.ObjectId(req.user._id));
    //console.log('Produ ct added to cart:', product);
   
    res.redirect('/cart');
  } catch (error) { 
    console.error('Error in postCart:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.postAddToCart=(req,res,next)=>{
  if (req.user.role!="buyer"){
    return res.redirect('/login')
  }
    const prodId=req.body.productId;
    
  
    // ✅ access after awaiting


Product.findById(prodId).then(product=>{

 const price=product.price
 const title=product.title
 const imageUrl=product.imageUrl
  console.log('priiice',price)
    Cart.addToCart(req.user._id,prodId,title,parseFloat(price),imageUrl).then(()=>{
        res.redirect('/cart')
    }).catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'database error!' });
      });

})
   
}
exports.postDeleteFromCart=(req,res,next)=>{
     const prodId=req.params.productId;
     Cart.deleteById(req.user._id,prodId).then(()=>{
        return console.log('DESTROYED PRODUCT');
    }).then(() => {
      console.log('DESTROYED PRODUCT');
      res.json({ message: 'Success!' });
    })
.catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Deleting product failed.' });
    });
}
exports.postAddToOrders=(req,res,next)=>{
  const prodId=req.body.productId
  const userId=req.user._id
  let title
  let price 
  const quantity=req.body.quantity
       const db=getDb();

    Order.addToOrders(userId,prodId,quantity).then(()=>{
      res.redirect('/orders')
    }) .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });

  

}
exports.getOrders=(req,res,next)=>{
  const db=getDb();
  return db.collection('order')
    .find({ userId: new mongodb.ObjectId(req.user._id) })
    .sort({ createdAt: -1 })       // sort by createdAt descending (newest first)
    
    .toArray()                     // toArray returns an array of matched docs
    .then(orders => {
          console.log('ORDERS SENT TO EJS:', orders);  // ✅ Check _id here

        res.render('orders', {
      
      pageTitle: 'orders', 
      path: '/orders',
      orders:orders,
        
      isAuthenticated: req.session.isLoggedIn
    });          // the latest order
    }) .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
    
    
   
  
}

exports.getOrder=(req,res,next)=>{
  const db=getDb();
  return db.collection('order')
    .find({ userId: new mongodb.ObjectId(req.user._id) })
    .sort({ createdAt: -1 })       // sort by createdAt descending (newest first)
    .limit(1)
    .toArray()                     // toArray returns an array of matched docs
    .then(orders => {
          console.log('ORDERS SENT TO EJS:', orders);  // ✅ Check _id here

        res.render('orders', {
      
      pageTitle: 'orders', 
      path: '/orders',
      orders:orders,
        
      isAuthenticated: req.session.isLoggedIn
    });          // the latest order
    }) .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
    
    
   
  
}
 


exports.newOrder=(req,res,next)=> {
  const db = getDb();

  // Step 1: Find the cart document by userId
  return db.collection('cart').findOne({ idUser: new mongodb.ObjectId(req.user._id) })
    .then(cart => {
      

      const cartItems = cart.products; // [{ productId, quantity }, ...]

      // Step 2: Extract productIds from cart items
      const productIds = cartItems.map(item => new mongodb.ObjectId(item.productId));

      // Step 3: Fetch product details for all cart productIds
      return db.collection('products').find({ _id: { $in: productIds } }).toArray()
        .then(products => {
          // Step 4: Map cart items with product info
          const orderItems = cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId.toString());
            if (!product) {
              throw new Error('Product not found: ' + cartItem.productId);
            }
            return {
              book: {
                _id: product._id,
                title: product.title,
                price: product.price
              },
              quantity: cartItem.qty
            };
          });

          // Step 5: Calculate total price
          

          // Step 6: Create order object
          const order = {
            userId: new mongodb.ObjectId(req.user._id),
            items: orderItems,
            totalPrice:cart.totalPrice,
            createdAt: new Date(),
            status: 'pending'
            
          };

          // Step 7: Insert order into orders collection
          return db.collection('order').insertOne(order)
        })
      })
    .then(() => {
      res.redirect('/order')
      console.log('Order created and cart cleared');
    })
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}

exports.getPDF=(req,res,next)=>{
const orderId = req.params.orderId;
  const db = getDb();

  db.collection('order')
    .findOne({ _id: new mongodb.ObjectId(orderId) })
    .then(order => {
      if (!order) {
        return res.status(404).send('Order not found');
      }

      // Generate PDF
      const doc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="invoice-${orderId}.pdf"`);

      doc.pipe(res); // Stream PDF to client

      // Invoice Header
      doc.fontSize(20).text('Invoice', { underline: true });
      doc.moveDown();
      doc.fontSize(14).text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(16).text('Order Summary:');
      doc.moveDown();

      let total = 0;

      order.items.forEach((item, index) => {
        const subtotal = item.book.price * item.quantity;
        total += subtotal;

        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${item.book.title} × ${item.quantity} — $${item.book.price}
              
             = $${subtotal}`
          );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { bold: true });

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('Thank you for your purchase!', {
        align: 'center',
        underline: true,
      });

      doc.end(); // Done writing PDF
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal server error');
    });
}

exports.fetchAllEx=(req,res,next)=>{
  const db = getDb(); // your MongoDB connection
const prodId=req.params.

db.collection('products')
  .find({ address: { $ne: excludedAddress } })
  .toArray()
  .then(products => {
    console.log(products); // all products except those with the excluded address
  })
  .catch(err => {
      console.log(err);
      res.status(500).send('Internal server error');
    });

}

exports.search=(req,res,next)=>{ 
    const query = req.query.q;
  const db=getDb();

  db.collection('products')
    .find({ title: { $regex: query, $options: 'i' } }) // case-insensitive
    .toArray()
    .then(books => {
      res.render('search-results', { books, query });
    })
    .catch(err => {
      console.error(err);
      res.redirect('/');
    });
} 

exports.postPay=(req,res,next)=>{
   const db=getDb();
   return db.collection('cart').findOne({idUser:new mongodb.ObjectId(req.user._id)}).then(cart=>{
     const line_items = cart.products.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.title },
      unit_amount: item.price * 100, // Stripe expects cents
    },
    quantity: item.qty
  }))

  stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: line_items,
  success_url: 'http://localhost:3000/success',
  cancel_url: 'http://localhost:3000/cancel',
})
.then(session => {
  res.redirect(303, session.url); // <== access it here
})
.catch(error => {
  console.error('Stripe error:', error);
  res.status(500).send('Payment initialization failed');
});
})
  }
 