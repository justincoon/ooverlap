var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
var User        = require('../lib/user');

router.get('/facebook', passport.authenticate('facebook', {
	scope: ['email', 'user_location']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.get('/google', passport.authenticate('google', {
	scope: ['profile email', 'email', 'openid', 'https://www.googleapis.com/auth/calendar'],
	accessType: 'offline',
	approvalPrompt: 'force'
}));

router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.post('/signup', function(req, res){
	var user = new User({
	   profile: {
	   	name: req.body.name
	   },
	   email: req.body.email,
	   password: req.body.password
	});
	User.findOne({ email: req.body.email }, function(err, existingUser) {
			if (existingUser) {
				res.send({error:'Account with that email address already exists.'});
				res.end();
				return false;
			}
			user.save(function(err) {
				req.logIn(user, function(err) {
					res.send();
					res.end();
				});
			});
	});
});


router.post('/login', function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			res.send({
				error: "ERROR"
			});
			res.end();
			return false;
		}
		if (!user) {
			res.send({
				error: info.message
			});
			res.end();
			return false;
		}
		req.logIn(user, function(err) {
			res.send();
			res.end();
		});
	})(req, res);
});

module.exports = router;
