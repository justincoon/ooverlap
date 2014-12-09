var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.user){
  	res.redirect('/user/profile');
  } else {
  	res.render('index', { title: 'OOverlap', user: req.user });
  }
});

module.exports = router;
