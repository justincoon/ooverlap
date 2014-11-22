var express = require('express');
var router = express.Router();
var gcal = require('google-calendar');
var refresh = require('google-refresh-token');
var keys = require('../config/keys.js');

router.get('/profile', function(req, res) {
  if (req.user){
  	res.render('profile', {user: req.user});
  } else {
  	res.redirect('/');
  }
});

router.get('/calendar', function(req, res) {
	if (req.user) {
		if(req.user.tokens[1]) //If we have a refresh token, ask for a new access token
		{
			refresh(req.user.tokens[1].refreshToken, keys.google.clientID, keys.google.clientSecret, function (err, json, res) {
				req.user.tokens[0].accessToken = json.accessToken;
			});
		}
		var google_calendar = new gcal.GoogleCalendar(req.user.tokens[0].accessToken);
		google_calendar.events.list(req.user.email, {'timeMin': (new Date()).toISOString()}, function(err, calendarList) {
      req.user.schedule = calendarList.items;
      res.render('calendar', {items: req.user.schedule});
		});
	} else {
		res.redirect('/');
	}
});

router.get('/checkcalendar', function(req,res){
  res.render('calendar', {items: req.user.schedule});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;
