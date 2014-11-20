var express = require('express');
var router = express.Router();

router.get('/profile', function(req, res) {
  if (req.user){
  	res.render('profile', {user: req.user});
  } else {
  	res.redirect('/');
  }
});

module.exports = router;
