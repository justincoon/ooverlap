var express     = require('express');
var router      = express.Router();
var flash       = require('express-flash');
var User        = require('../lib/user');
var querystring = require('querystring');
var url 	    = require('url');
var request_friend;
var meeting_request;
var reply_request = -1;

router.get('/', function(req, res) {
  if (request_friend) {
    reply_request = -1;
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
      items.push({
        title: item.summary,
        color: '#ff0000',
        start: item.start.dateTime,
        end: item.end.dateTime,
        editable: false
      });
    } else {
      items.push({
        title: item.summary,
        color: '#ff0000',
        start: item.start.date,
        end: item.end.date,
        editable: false
      });
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
    if (reply_request >= 0) {
      JSON.parse(req.user.request[reply_request].free_times).forEach(function(item) {
        if (item.start && item.end) {
          items.push({
            title: user.profile.name + " Availability",
            color: '#0000ff',
            start: item.start,
            end: item.end,
            editable: false
          });
        } else {
          items.push({
            title: user.profile.name + " Availability",
            color: '#0000ff',
            start: item.start,
            editable: false
          });
        }
      });
    }
    user.schedule.forEach(function(item) {
      if (item.start.dateTime && item.end.dateTime) {
        items.push({
          title: user.profile.name + " Schedule",
          color: '#ffa500',
          start: item.start.dateTime,
          end: item.end.dateTime,
          editable: false
        });
      } else {
        items.push({
          title: user.profile.name + " Schedule",
          color: '#ffa500',
          start: item.start.date,
          end: item.end.date,
          editable: false
        });
      }
    });
    res.send(items);
    res.end();
  });
});

router.get('/view/:idx', function(req,res){
  var index = req.params.idx;
  var requests = req.user.request;
  if (index >=0 && index < requests.length && requests[index].type === 'meeting_request'){
    var request = requests[index];
    reply_request = index;
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
  } else {
    res.redirect('/');
  }
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