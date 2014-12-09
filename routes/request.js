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

//This route is to pull calendar or two user who are scheduling request
router.get('/schedule', function(req, res) {
  var items = []
  req.user.schedule.forEach(function(item) {
    if (item.start.dateTime && item.end.dateTime) {
      items.push({
        title: item.summary,
        color: '#D31900',
        start: item.start.dateTime,
        end: item.end.dateTime,
        editable: false
      });
    } else {
      items.push({
        title: item.summary,
        color: '#D31900',
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
            color: '#1BB0CE',
            start: item.start,
            end: item.end,
            editable: false,
            overlap: true
          });
        } else {
          items.push({
            title: user.profile.name + " Availability",
            color: '#1BB0CE',
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
          color: '#FFC52C',
          start: item.start.dateTime,
          end: item.end.dateTime,
          editable: false
        });
      } else {
        items.push({
          title: user.profile.name + " Schedule",
          color: '#FFC52C',
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

//This route is to view a pending meeting request
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

//This route is to submit meeting request and figure out overlap time
router.post('/submit', function(req, res) {
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
    var hours = parseInt(request.meeting.hours);
    var minutes = parseInt(request.meeting.minutes);
    var duration = hours*60 + minutes;
    console.log("User free times: " + free_times);
    console.log("Friend free times: " + request.free_times);
    console.log("Duration: " + duration);
    var user_free_time, user_start, user_end, friend_free_time, friend_start, friend_end, diff, tmp_date;
    var priority_sum = 10;
    var priority_diff = 5;
    var meeting_start, meeting_end;
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
        if (user_end.isAfter(friend_start)){
          //if they overlap
          if (user_end.isBefore(friend_end)){
            diff = Math.abs(user_end.diff(friend_start, 'minutes'));
          } else {
            diff = Math.abs(friend_start.diff(friend_end, 'minutes'));
          }
          if (diff >= duration){
            if (user_free_time.priority + friend_free_time.priority < priority_sum){
              priority_sum = user_free_time.priority + friend_free_time.priority;
              priority_diff = Math.abs(user_free_time.priority - friend_free_time.priority);
              meeting_start = friend_start;
            } else if (user_free_time.priority + friend_free_time.priority == priority_sum){
              priority_diff = Math.min(priority_diff, Math.abs(user_free_time.priority - friend_free_time.priority));
              meeting_start = friend_start;
            }
          }
        } 
      }
    }
    if (meeting_start){
      var meeting_end = moment(meeting_start);
      meeting_end.hours(meeting_start.hours()+hours);
      meeting_end.minutes(meeting_start.minutes()+minutes);
      var meeting = {
        title: request.meeting.title,
        start:meeting_start.format(),
        start_format: meeting_start.format('MMM Do YYYY, h:mm:ss a'),
        end:meeting_end.format(),
        end_format: meeting_end.format('MMM Do YYYY, h:mm:ss a'),
        from: request.from
      }
      User.findById(req.user.id, function(err, user) {
        user.request.splice(reply_request,1);
        user.events.push({
          status: 'successful',
          meeting: meeting
        });
        user.save(function(err) {
          req.flash('info', {
            msg: 'New event has been added.'
          });
          User.findOne({
            email: request.from
          }, function(err, user) {
            meeting.from = request.to;
            user.events.push({
              status: 'successful',
              meeting: meeting
            });
            user.save(function(err) {
              req.flash('info', {
                msg: 'New event has been added.'
              });
              res.send();
              res.end();
            });
          });
        });
      });
    } else {
      var meeting = {
        title: request.meeting.title,
        from: request.from
      }
      User.findById(req.user.id, function(err, user) {
        user.request.splice(reply_request,1);
        user.events.push({
          status: 'fail',
          meeting: meeting
        });
        user.save(function(err) {
          req.flash('info', {
            msg: 'New event has been added.'
          });
          User.findOne({
            email: request.from
          }, function(err, user) {
            meeting.from = request.to;
            user.events.push({
              status: 'fail',
              meeting: meeting
            });
            user.save(function(err) {
              req.flash('info', {
                msg: 'New event has been added.'
              });
              res.send();
              res.end();
            });
          });
        });
      });
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
