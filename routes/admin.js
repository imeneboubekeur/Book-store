const express=require('express')
const router=express.Router()
const admin=require('../controllers/admin')
const isAuth=require('./is-auth')
const isAdmin=require('./is-admin')


router.get('/',admin.admin)
router.get('/admin/add-product',isAdmin,isAuth,admin.addProduct)
//router.post('/',admin.postAddProduct)
router.get('/admin/products',isAdmin,isAuth,admin.products)
router.get('/admin/edit-product/:productId',admin.getEditProduct)
router.post('/admin/edit-product',admin.postEditProduct)
router.delete('/delete-product/:productId',admin.postDeleteProduct)
router.post('/admin/delete-product',admin.deleteProduct)

router.get('/admin/search',admin.search)

module.exports=router; 