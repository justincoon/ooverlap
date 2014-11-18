var express = require('express');
var router = express.Router();
var querystring = require('querystring');

router.post('/', function(req, res) {
	var query = querystring.parse(url.parse(req.url).query);
	var username = query.username;
	var location = query.password;
  res.render('index', { title: 'OOverlap' });
});

module.exports = router