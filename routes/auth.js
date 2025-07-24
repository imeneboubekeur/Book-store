const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);
router.post('/signup',authController.postSignup);
router.get('/signup', authController.getSignup);
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect('/'); // fallback
    }  
    res.redirect('/admin');
  });  
});
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});
router.post('/forgot-password',authController.forgotPass)
router.get('/reset-password/:token',authController.resetPass)
router.post('/reset-password',authController.postResetPass)
module.exports = router;