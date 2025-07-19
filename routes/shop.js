const express=require('express')
const router=express.Router()
const shop=require('../controllers/shop')
const isAuth=require('./is-auth')

router.get('/products',shop.getProducts)
router.post('/cart', shop.postAddToCart);
 router.get('/cart', isAuth,shop.getCart);
router.delete('/cart-delete-item:productId',shop.postDeleteFromCart)
 //router.post('/cart-delete-item',shop.postDeleteFromCart)
router.post('/order',shop.newOrder)
router.get('/orders',shop.getOrders)
router.get('/order/:orderId/invoice',shop.getPDF)
router.get('/products/:prodId',shop.signleProduct)
module.exports=router; 