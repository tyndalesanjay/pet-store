var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', my_session : req.session });
});

module.exports = router;
