const express=require('express')
const router=express.Router()
const admin=require('../controllers/admin')
const isAuth=require('./is-auth')
const isAdmin=require('./is-admin')


router.get('/home',admin.admin)
router.get('/admin/add-product',isAdmin,isAuth,admin.addProduct)
//router.post('/',admin.postAddProduct)
router.get('/admin/products',isAdmin,isAuth,admin.products)
router.get('/admin/edit-product/:productId',admin.getEditProduct)
router.post('/admin/edit-product',admin.postEditProduct)
router.post('/admin/delete-product',admin.postDeleteProduct)
router.get('/search',admin.search)
module.exports=router; 