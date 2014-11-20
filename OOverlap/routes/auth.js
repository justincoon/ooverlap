var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
var userController = require('../config/user');

router.get('/facebook', passport.authenticate('facebook', {
	scope: ['email', 'user_location']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.get('/google', passport.authenticate('google', {
	scope: 'profile email'
}));

router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/user/profile');
});

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

module.exports = router;
