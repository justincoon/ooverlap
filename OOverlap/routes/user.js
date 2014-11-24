var express = require('express');
var router  = express.Router();
var gcal    = require('google-calendar');
var refresh = require('google-refresh-token');
var flash   = require('express-flash');
var keys    = require('../config/keys.js');
var User    = require('../lib/user');

router.get('/profile', function(req, res) {
  if (req.user) {
    res.render('profile', {
      user: req.user,
    });
  } else {
    res.redirect('/');
  }
});

router.get('/calendar', function(req, res) {
  if (req.user) {
    if (req.user.tokens[1]) //If we have a refresh token, ask for a new access token
    {
      refresh(req.user.tokens[1].refreshToken, keys.google.clientID, keys.google.clientSecret, function(err, json, res) {
        req.user.tokens[0].accessToken = json.accessToken;
      });
    }
    var google_calendar = new gcal.GoogleCalendar(req.user.tokens[0].accessToken);
    google_calendar.events.list(req.user.email, {
          'timeMin': (new Date()).toISOString(),
          'singleEvents': true
        }, function(err, calendarList) {
          User.findById(req.user.id, function(err, user) {
            user.schedule = calendarList.items;
            user.save(function(err) {
              req.flash('info', {
                msg: 'Schedule has been saved.'
              });
              res.redirect('/');
            });
          });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/checkcalendar', function(req, res) {
  res.render('calendar', {
    items: req.user.schedule
  });
});

router.get('/schedule', function(req, res) {
  var items = []
  req.user.schedule.forEach(function(item) {
    if (item.start.dateTime && item.end.dateTime){
      items[items.length] = {
        title : item.summary,
        start : item.start.dateTime,
        end : item.end.dateTime
      };
    } else {
      items[items.length] = {
        title : item.summary,
        start : item.start.date,
        end : item.end.date
      };
    }
  });
  res.send(items);
  res.end();
});

router.get('/request', function(req,res){
  if (req.user) {
    res.render('request', {
      user: req.user,
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