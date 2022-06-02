var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET Login Page. */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'Login'})
});

// Session Login
router.post('/authlogin', function(req, res, next) {
       
  var email = req.body.email;
  var password = req.body.password;
  conn.query('SELECT * FROM pet_store.admin WHERE email = ? AND BINARY password = ?', [email, password], function(err, results, fields) {
      // if login is incorrect or not found
      console.log(results.length);
      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!')
          res.redirect('/login')
      }
      else { // if login found
          //Assign session variables based on login credentials                
          req.session.loggedin = true;
          req.session.eid = results[0].id,
          req.session.first_name = results[0].fName;
          req.session.last_name = results[0].lName;
          // req.session.returnTo = req.originalUrl
          // req.session.is_admin = results[0].is_admin;
          res.redirect('/admin')
          // res.redirect(req.session.returnTo || '/admin')
          // delete req.session.returnTo;
      }            
  })
})

// Logout Admin
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
  });

/* ************************************************************************************** */

/* GET Login Page. */
router.get('/user_login', function(req, res, next) {
  res.render('user_login', {title: 'Login'})
});

// Session Login
router.post('/userlogin', function(req, res, next) {
       
  var email = req.body.email;
  var password = req.body.password;
  conn.query('SELECT * FROM pet_store.customer WHERE email = ? AND BINARY password = ?', [email, password], function(err, results) {
      // if login is incorrect or not found
      console.log(results.length);
      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!')
          res.redirect('/login')
      }
      else { // if login found
          //Assign session variables based on login credentials                
          req.session.loggedin = true;
          req.session.cid = results[0].id,
          req.session.first_name = results[0].fName;
          req.session.last_name = results[0].lName;
          // req.session.is_admin = results[0].is_admin;
          // console.log(req.session);
          res.redirect('/user/view_item')
      }            
  })
})

// Logout user
router.get('/userlogout', function (req, res) {
  req.session.destroy();
  res.redirect('/login/user_login');
});

module.exports = router;
