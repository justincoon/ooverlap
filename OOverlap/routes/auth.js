var express     = require('express');
var router      = express.Router();
var passport    = require('passport');

router.get('/facebook', passport.authenticate('facebook', {
	scope: ['email', 'user_location']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.get('/google', passport.authenticate('google', {
	scope: ['profile email', 'email', 'openid', 'https://www.googleapis.com/auth/calendar']
}));

router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.get('/login', passport.authenticate('google', {
	scope: ['email', 'password']
}));

router.get('/login/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

module.exports = router;
