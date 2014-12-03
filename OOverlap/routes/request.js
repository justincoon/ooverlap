var express     = require('express');
var router      = express.Router();
var flash       = require('express-flash');
var User        = require('../lib/user');
var querystring = require('querystring');
var url         = require('url');
var moment      = require('moment');
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
    if (!user){
      console.log('Email ' + friend_email + ' not found');
      res.end();
      return false;
    }
    if (reply_request >= 0) {
      JSON.parse(req.user.request[reply_request].free_times).forEach(function(item) {
        if (item.start && item.end) {
          items.push({
            title: user.profile.name + " Availability",
            color: '#0000ff',
            start: item.start,
            end: item.end,
            editable: false,
            overlap: true
          });
        } else {
          items.push({
            title: user.profile.name + " Availability",
            color: '#0000ff',
            start: item.start,
            editable: false,
            overlap: true
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
    console.log(reply_request);
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
  console.log(reply_request);
  var free_times = req.body.free_times;
  if (reply_request < 0){
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
  } else {
    var user_free_times = JSON.parse(free_times);
    var request = req.user.request[reply_request];
    var friend_free_times = JSON.parse(request.free_times);
    var duration = moment(request.meeting.hours+':'+request.meeting.minutes,'HH:mm');
    console.log("User free times: " + free_times);
    console.log("Friend free times: " + request.free_times);
    console.log("Duration: " + duration.format());
    var user_free_time;
    var user_start;
    var user_end;
    var friend_free_time;
    var friend_start;
    var friend_end;
    var diff;
    var tmp_date;
    for (var i=0; i<user_free_times.length; i++){
      for (var j=0; j<friend_free_times.length; j++){
        user_free_time = user_free_times[i];
        friend_free_time =friend_free_times[j];
        if (user_free_time.end){
          //normal timeDate event
          user_start = moment(user_free_time.start);
          user_end = moment(user_free_time.end);
        } else {
          //all day event
          user_start = moment(user_free_time.start);
          user_end = moment(user_free_time.start);
          user_end.hours('23');
          user_end.minutes('59');
          user_end.seconds('59');
        }
        if (friend_free_time.end){
          //normal timeDate event
          friend_start = moment(friend_free_time.start);
          friend_end = moment(friend_free_time.end);
        } else {
          //all day event
          friend_start = moment(friend_free_time.start);
          friend_end = moment(friend_free_time.start);
          friend_end.hours('23');
          friend_end.minutes('59');
          friend_end.seconds('59');   
        }
        if (user_start.isAfter(friend_start)){ 
          //swap date so user_start will always be before friend_start
          //hacky thing to reduce if statments
          tmp_date = moment(user_start);
          user_start = moment(friend_start);
          friend_start = moment(tmp_date);
          tmp_date = moment(user_end);
          user_end = moment(friend_end);
          friend_end = moment(tmp_date);
        } 
        // console.log("User start: " + user_start.format());
        // console.log("User end: " + user_end.format());
        // console.log("Friend start: " + user_start.format());
        // console.log("Friend end: " + user_end.format());
        if (user_end.isAfter(friend_start)){
          //if they overlap
          if (user_end.isBefore(friend_end)){
            diff = Math.abs(user_end.diff(friend_start));
          } else {
            diff = Math.abs(friend_start.diff(friend_end));
          }
          console.log("Difference: " + diff);
        } 
      }
    }
  }
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