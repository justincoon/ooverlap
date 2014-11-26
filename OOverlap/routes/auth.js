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
	   email: req.body.email,
	   password: req.body.password
	});
	User.findOne({ email: req.body.email }, function(err, existingUser) {
			if(req.body.password !== req.body.confirm){
				return res.redirect('/');//to implent
			}	
			if (existingUser) {
				req.flash('errors', { msg: 'Account with that email address already exists.' });
				return res.redirect('/exist');//implement further
			}
			user.save(function(err) {
				if (err) return next(err);
				req.logIn(user, function(err) {
					if (err) return next(err);
					res.redirect('/user/profile');
				});
			});
	});
});


router.post('/login', function(req, res){
  passport.authenticate('local', function(err, user, info) {})(req, res);

});

module.exports = router;
