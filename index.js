require('dotenv').config();

const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const path = require('path');
const User=require('./models/user');
const mongoConnect = require('./databse/database').mongoConnect;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000; // fallback to 3000 if not defined
const MONGODB_URI =
process.env.MONGODB_URI
;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookstore-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
/*const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    //cb(null, new Date().toISOString() + '-' + file.originalname);
  const safeName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
  cb(null, safeName);
  }
});*/
const upload = multer({ storage });

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(flash());

const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const authRoutes=require('./routes/auth')
const adminController = require('./controllers/admin');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ storage: fileStorage }).single('image'));
/*const upload = multer({ storage: fileStorage });*/

//app.post('/', upload.single('image'), adminController.postAddProduct);
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/images', express.static(path.join(__dirname, 'images')));



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

/*app.use((req, res, next) => { 
  
  if (!req.session.user) {
    console.log('no session')
     next();
  }})*/
app.use((req, res, next) => { 
  
  if (!req.session.user) {
    console.log('no session')
    return next();
  }
  User.findById(req.session.user._id) 
    .then(user => {
      if (!user) return next()
   
    console.log('requser is defiiined')
      req.user =new User(user.email,user.password,user._id,user.role);
          console.log('requser is defiiined',req.user)

      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.post('/', upload.single('image'), adminController.postAddProduct);

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404'
  });
});
mongoConnect(()=>{app.listen(PORT,()=>{   
    console.log(`✅ Server is running on port ${PORT}`);
});})
