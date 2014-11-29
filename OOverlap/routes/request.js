var express     = require('express');
var router      = express.Router();
var flash       = require('express-flash');
var User        = require('../lib/user');
var querystring = require('querystring');
var url 	    = require('url');
var request_friend;
var meeting_request;

router.get('/', function(req, res) {
  if (request_friend) {
    res.render("request", {
      request: meeting_request,
      user: req.user,
      friend: request_friend
    });
  } else {
    res.redirect('/');
  }
});

router.post('/new',function(req, res){
    meeting_request = req.body;
    res.send("");
    res.end();
});

router.get('/schedule', function(req, res) {
  var items = []
  req.user.schedule.forEach(function(item) {
    if (item.start.dateTime && item.end.dateTime) {
      items[items.length] = {
        title: item.summary,
        color: '#ff0000',
        start: item.start.dateTime,
        end: item.end.dateTime,
        editable: false
      };
    } else {
      items[items.length] = {
        title: item.summary,
        color: '#ff0000',
        start: item.start.date,
        end: item.end.date,
        editable: false
      };
    }
  });
  var query = querystring.parse(url.parse(req.url).query);
  var friend_email = query.friend_email;
  User.findOne({
    email: friend_email
  }, function(err, user) {
    if (!user)
      return done(null, false, {
        message: 'Email ' + email + ' not found'
      });
    user.schedule.forEach(function(item) {
      if (item.start.dateTime && item.end.dateTime) {
        items[items.length] = {
          title: user.profile.name + " Schedule",
          color: '#ffa500',
          start: item.start.dateTime,
          end: item.end.dateTime,
          editable: false
        };
      } else {
        items[items.length] = {
          title: user.profile.name + " Schedule",
          color: '#ffa500',
          start: item.start.date,
          end: item.end.date,
          editable: false
        };
      }
    });
    res.send(items);
    res.end();
  });
});

router.get('/view/:idx', function(req,res){
  var request = req.user.request[req.params.idx];
  User.findOne({
    email: request.from
  }, function(err, user) {
    res.render("request", {
      user: req.user,
      friend: {
        name: user.profile.name,
        picture: user.profile.picture,
        email: user.email
      },
      request: request.meeting
    });
  });
});

router.post('/submit', function(req, res) {
  var free_times = req.body.free_times;
  User.findOne({
    email: req.body.to
  }, function(err, user) {
    user.request.push({
      type: 'meeting_request',
      from: req.body.from,
      to: req.body.to,
      meeting: meeting_request,
      free_times: req.body.free_times
    })
    user.save(function(err) {
      req.flash('info', {
        msg: 'New request has been saved.'
      });
      res.redirect('/');
    });
  });
});

router.post('/get_friend', function(req, res) {
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

module.exports = router;