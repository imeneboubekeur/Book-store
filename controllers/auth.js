const User=require('../models/user');
const Cart=require('../models/cart') 
const Order=require('../models/order') 

const mongodb = require('mongodb');
const getDb = require('../databse/database').getDb;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');





exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    res.render('login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: message

    });
  };
  exports.postLogin = (req, res, next) => {
    
    const db=getDb();
    const email=req.body.email;
    const password=req.body.password;
    //User.findById(new mongodb.ObjectId('6819cf99ac426e5b6846549d'))
    db.collection('user').findOne({email:email})
      .then(user => {
        if (!user) {
          req.flash('error', 'Invalid email or password.');

          return res.redirect('/login');
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
          if (doMatch){ 
            console.log("user,postlogiiin")
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log("session ussseer",req.session.user)
           return req.session.save(err => {
              console.log(err);
              console.log("session ussseer",req.session.user)
            if (user.role === "admin") {
     res.redirect("/admin/products");
  } else {
     res.redirect("/products");
  }
              //res.redirect('/products');
            }); 
          }
          req.flash('error', 'Invalid email or password.');

         return res.redirect('/login');
        
      })
    })
      .catch(err => console.log(err));
  };
 
  exports.postSignup=(req,res,next) => {
    const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const db=getDb();
db.collection('user').findOne({email:email}).then(userDoc=>{
  if (userDoc) {
    req.flash('error', 'E-Mail exists already, please pick a different one.');

    return res.redirect('/signup');
  }
  return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user=new User(email,hashedPassword);
            return user.save();
          }).then(()=>{
           return db.collection('user').findOne({email:email}).then(user=>{
                const cart=new Cart(user._id)
                 cart.save()
            })
          }).then(()=>{
            return db.collection('user').findOne({email:email}).then(user=>{
                const order=new Order(user._id)
                 order.save()}) })
          .then(() => {
              res.redirect('/login');
            })
            .catch(err => {
              console.log('Email send failed:', err);
              res.redirect('/signup');
            });
          }); 
 
}
  exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    res.render('signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: message

    });
  };
  exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/login');
    });
  };