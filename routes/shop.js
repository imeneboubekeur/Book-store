const express=require('express')
const router=express.Router()
const shop=require('../controllers/shop')
const isAuth=require('./is-auth')

router.get('/products',shop.getProducts)
router.post('/cart', shop.postAddToCart);
 router.get('/cart',shop.getCart);
router.delete('/cart-delete-item:productId',shop.postDeleteFromCart)
 //router.post('/cart-delete-item',shop.postDeleteFromCart)
router.post('/order',shop.newOrder)
router.get('/orders',shop.getOrders)
router.get('/order/:orderId/invoice',shop.getPDF)
router.get('/products/:prodId',shop.signleProduct)
router.get('/search',shop.search)
router.post('/create-checkout-session',shop.postPay)



module.exports = router;