var express     = require('express');
var router      = express.Router();
var passport    = require('passport');

router.get('/facebook', passport.authenticate('facebook', {
	scope: ['email', 'user_location']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
	scope: 'profile email'
}));

router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/');
});

module.exports = router
