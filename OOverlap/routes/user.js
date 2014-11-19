var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/profile', function(req, res) {
  res.render('profile', {user: req.user});
});

module.exports = router;
