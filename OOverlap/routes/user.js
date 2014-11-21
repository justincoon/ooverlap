var express = require('express');
var router = express.Router();
var gcal = require('google-calendar');

router.get('/profile', function(req, res) {
  if (req.user){
  	res.render('profile', {user: req.user});
  } else {
  	res.redirect('/');
  }
});

router.get('/calendar', function(req, res) {
	if (req.user) {
    		var google_calendar = new gcal.GoogleCalendar(req.user.tokens[0].accessToken);
		google_calendar.events.list(req.user.email, {'timeMin': (new Date()).toISOString()}, function(err, calendarList) {
			console.log(calendarList.items);
			res.send(calendarList);
		});
	} else {
		res.redirect('/');
	}
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;
