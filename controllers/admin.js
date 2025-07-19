const Product=require('../models/product')

exports.admin=(req,res,next)=>{
    res.render('home',{
        path:'/home'
    })
}
exports.addProduct=(req,res,next)=>{
    res.render('add-product',{
        path:'/admin/add-product'
    })
}
exports.postAddProduct=(req,res,next)=>{
    //console.log(req.body)
const title = req.body.title;
    //const imageUrl = req.body.imageUrl;
      const image = req.file;
      //const imageUrl=req.body.image;
      console.log("iiimaaage",req.file)
    const price = req.body.price;
    const description = req.body.description;
      const imageUrl = image.path;
    const product = new Product(title, price, description, imageUrl,null,req.user._id);
    console.log(product);
    product
      .save()
      .then(result => {
        // console.log(result);
        console.log(result);
        res.redirect('/admin/products'); 
      })
      .catch(err => {
        console.log(err);
      });
  };
  exports.products=(req,res,next)=>{
    Product.fetchByIdUser(req.user._id).then(products=>{
        res.render('productsAdmin',{
            path:'/admin/products',
            prods:products
        })
    })
  }
exports.getEditProduct=(req,res,next)=>{
    const prodId=req.params.productId
    Product.findById(prodId).then(product=>{
res.render('edit-product',{
        path:'/admin/edit-product',
        product:product
    })
    })
}
exports.postEditProduct=(req,res,next)=>{
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
        //console.log('updaaaate1',updatedDesc)
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.idUser=req.user._id;
      //console.log('updaaaate1',product.description)

      product.description = updatedDesc;
        console.log('updaaaate1',product)

      product.imageUrl = updatedImageUrl;
      //product._id=prodId
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}
exports.postDeleteProduct=(req,res,next)=>{
    const prodId=req.body.productId

    Product.deleteById(prodId).then(res.redirect('/admin/products'))
}