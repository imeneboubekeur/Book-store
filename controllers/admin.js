const Product=require('../models/product')
const getDb = require('../databse/database').getDb;

exports.admin=(req,res,next)=>{
    res.render('home',{
        path:'/'
    },
    (err, html) => {
  if (err) {
    console.error('Error rendering add-product:', err);
    return res.status(500).json({
      status: 'fail',
      message: 'View rendering failed: ' + err.message
    });
  }
  res.send(html);
});
  

}

exports.addProduct=(req,res,next)=>{
    res.render('add-product', { path: '/admin/add-product' }, (err, html) => {
  if (err) {
    console.error('Error rendering add-product:', err);
    return res.status(500).json({
      status: 'fail',
      message: 'View rendering failed: ' + err.message
    });
  }
  res.send(html);
});

};

exports.postAddProduct=(req,res,next)=>{
    console.log('bodyy',req.body)
    console.log('requser is',req.user)
const title = req.body.title;
const author = req.body.author;

    //const imageUrl = req.body.imageUrl;
      const image = req.file;
      //const imageUrl=req.body.image;
      console.log("iiimaaage",req.file)
    const price = req.body.price;
    const description = req.body.description;
      const imageUrl = image.path;
    const product = new Product(title,author, price, description, imageUrl,null,req.user._id);
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
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
  };
  exports.products=(req,res,next)=>{
    Product.fetchByIdUser(req.user._id).then(products=>{
console.log('cloudUrlll',products.imageUrl)
        res.render('productsAdmin',{
            path:'/admin/products',
            prods:products
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
  }
exports.getEditProduct=(req,res,next)=>{
    const prodId=req.params.productId
    Product.findById(prodId).then(product=>{
res.render('edit-product',{
        path:'/admin/edit-product',
        product:product
    })
    }).catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
}
exports.postEditProduct=(req,res,next)=>{
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
    const updatedAuthor = req.body.author;

  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
        //console.log('updaaaate1',updatedDesc)
      product.title = updatedTitle;
      product.author=updatedAuthor;
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
   .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
}
exports.postDeleteProduct=(req,res,next)=>{
   // const prodId=req.body.productId
     const prodIdd=req.params.productId;
console.log('current id ',prodIdd)
    Product.deleteById(prodIdd).then(()=>{
     return console.log('DESTROYED PRODUCT');
    }).then(() => {
      console.log('DESTROYED PRODUCT');
      res.json({ message: 'Success!' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json( 
        { status:'fails',message: 'server error!' });
      });
}

exports.search=(req,res,next)=>{ 
    const query = req.query.q;
  const db=getDb();

  db.collection('products')
    .find({ title: { $regex: query, $options: 'i' }, idUser:req.user._id }) // case-insensitive
    .toArray()
    .then(books => {
      res.render('search-results', { books, query });
    })
    .catch(err => {
      console.error(err); 
res.status(500).json( 
        { status:'fails',message: 'database error!' })    });
} 