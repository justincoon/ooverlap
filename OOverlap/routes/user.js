var express = require('express');
var router = express.Router();
var gcal = require('google-calendar');
var refresh = require('google-refresh-token');
var flash = require('express-flash');
var keys = require('../config/keys.js');
var User = require('../lib/user');
var request_friend;
var add_friend;

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
      console.log(req.user.tokens);
      refresh(req.user.tokens[1].refreshToken, keys.google.clientID, keys.google.clientSecret, function(err, json, res) {
        User.findById(req.user.id, function(err, user) {
          user.tokens[0].accessToken = json.accessToken;
          user.save(function(err) {
            req.flash('info', {
              msg: 'Schedule has been saved.'
            });
          });
          console.log(req.user.tokens);
        });
      });
    }
    var google_calendar = new gcal.GoogleCalendar(req.user.tokens[0].accessToken);
    var timeMin = new Date();
    var timeMax = new Date();
    timeMax.setFullYear(timeMin.getFullYear()+1);
    google_calendar.events.list(req.user.email, {
      'timeMin': timeMin.toISOString(),
      'timeMax': timeMax.toISOString(),
      'singleEvents': true
    }, function(err, calendarList) {
      if (err){
        console.log(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.schedule = calendarList.items;
          user.save(function(err) {
            req.flash('info', {
              msg: 'Schedule has been saved.'
            });
            res.redirect('/');
          });
        });
      }
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
    if (item.start.dateTime && item.end.dateTime) {
      items[items.length] = {
        title: item.summary,
        start: item.start.dateTime,
        end: item.end.dateTime
      };
    } else {
      items[items.length] = {
        title: item.summary,
        start: item.start.date,
        end: item.end.date
      };
    }
  });
  res.send(items);
  res.end();
});

router.get('/schedule_request', function(req, res) {
  var items = []
  req.user.schedule.forEach(function(item) {
    if (item.start.dateTime && item.end.dateTime) {
      items[items.length] = {
        title: item.summary,
        color: '#ff0000',
        start: item.start.dateTime,
        end: item.end.dateTime
      };
    } else {
      items[items.length] = {
        title: item.summary,
        color: '#ff0000',
        start: item.start.date,
        end: item.end.date
      };
    }
  });
  User.findOne({
    email: request_friend.email
  }, function(err, user) {
    if (!user)
      return done(null, false, {
        message: 'Email ' + email + ' not found'
      });
    user.schedule.forEach(function(item) {
      if (item.start.dateTime && item.end.dateTime) {
        items[items.length] = {
          title: request_friend.name + " Schedule",
          color: '#ffa500',
          start: item.start.dateTime,
          end: item.end.dateTime
        };
      } else {
        items[items.length] = {
          title: request_friend.name + " Schedule",
          color: '#ffa500',
          start: item.start.date,
          end: item.end.date
        };
      }
    });
    res.send(items);
    res.end();
  });
});

router.get('/request', function(req, res) {
  if (request_friend) {
    res.render("request", {
      user: req.user,
      friend: request_friend
    });
  } else {
    res.redirect('/');
  }
});

router.get('/friend_request', function(req, res) {
  if (add_friend) {
    User.findOne({
      email: add_friend.email
    }, function(err, user) {
      user.request.push({
        type: 'friend_request',
        data: {
          name: req.user.profile.name,
          email: req.user.email,
          picture: req.user.profile.picture
        }
      });
      user.save(function(err) {
        req.flash('info', {
          msg: 'New request has been saved.'
        });
        res.redirect('/');
      });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/add_friend/:idx', function(req, res) {
  request = req.user.request[req.params.idx];

  User.findById(req.user.id, function(err, user) {
    user.friends.push(request.data);
    user.request.splice(req.params.idx, 1);
    user.save(function(err) {
      req.flash('info', {
        msg: 'Schedule has been saved.'
      });
      User.findOne({
        email: request.data.email
      }, function(err, user) {
        user.friends.push({
          name: req.user.profile.name,
          email: req.user.email,
          picture: req.user.profile.picture
        });
        user.save(function(err) {
          req.flash('info', {
            msg: 'New request has been saved.'
          });
          res.redirect('/');
        });
      });
    });
  });
});

router.get('/group', function(req, res) {
  if (req.user) {
    res.render('group', {
      user: req.user,
    });
  } else {
    res.redirect('/');
  }
});

router.post('/get-friend', function(req, res) {
  var email = req.body.email;
  var friends = req.user.friends;
  for (var i = 0; i < friends.length; i++) {
    if (email === friends[i].email) {
      res.send(friends[i]);
      request_friend = friends[i];
      break;
    }
  }
  res.end();
});

router.post('/find-friend', function(req, res) {
  var email = req.body.email;
  User.findOne({
    email: email
  }, function(err, user) {
    if (!user) {
      res.send({
        error: true,
        request_sent_exist: false,
        request_received_exist: false,
        friend_exist: false,
        friend: {}
      });
      res.end();
    } else {
      var exist = false;
      for (var i=0; i<req.user.request.length; i++){
        if (req.user.request[i].type === 'friend_request' && req.user.request[i].data.email === req.body.email){
          res.send({
            error: false,
            request_send_exist: false,
            request_received_exist: true,
            friend_exist: false,
            friend: {}
          });
          res.end();
          exist = true;
          break;
        }
      }
      if (!exist){
        for (var i=0; i<req.user.friends.length; i++){
          if (req.user.friends[i].email === user.email) {
            res.send({
              error: false,
              request_send_exist: false,
              request_received_exist: false,
              friend_exist: true,
              friend: {}
            });
            res.end();
            exist = true;
            break;
          }
        }
      }
      if (!exist){
        for (var i=0; i<user.request.length; i++){
          if (user.request[i].type === 'friend_request' && user.request[i].data.email === req.user.email){
          res.send({
            error: false,
            request_sent_exist: true,
            request_received_exist: false,
            friend_exist: false,
            friend: {}
          });
          res.end();
          exist = true;   
          break;
          }
        }
      }
      if (!exist){
        add_friend = {
          name: user.profile.name,
          email: user.email,
          picture: user.profile.picture
        };
        res.send({
            error: false,
            request_send_exist: false,
            request_received_exist: false,  
            friend_exist: false,
            friend: add_friend
          });
        res.end();
      }
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;