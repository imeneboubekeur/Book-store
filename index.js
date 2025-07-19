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

const MONGODB_URI =
'mongodb+srv://imene:imene9005@cluster0.mx3k5.mongodb.net/shop?tls=true&retryWrites=true&w=majority&appName=Cluster0'  
;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    //cb(null, new Date().toISOString() + '-' + file.originalname);
  const safeName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
  cb(null, safeName);
  }
});

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(flash());

const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const authRoutes=require('./routes/auth')
const adminController = require('./controllers/admin');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'));
const upload = multer({ storage: fileStorage });

app.post('/admin', upload.single('image'), adminController.postAddProduct);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
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
      
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  
res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = req.session.isLoggedIn|| false;
  
  next(); // ✅ Always call next
});

app.use(adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
mongoConnect(()=>{app.listen(3000,()=>{   
    console.log('server is running on port 3000')
});})
