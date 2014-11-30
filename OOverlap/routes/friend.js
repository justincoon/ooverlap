var express     = require('express');
var router      = express.Router();
var flash       = require('express-flash');
var User        = require('../lib/user');

var add_friend;

router.get('/new_request', function(req, res) {
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
        res.send({status:true});
        res.end();
      });
    });
  } else {
    res.send({status:false});
    res.end();
  }
});

router.get('/add/:idx', function(req, res) {
  var request = req.user.request[req.params.idx];
  User.findById(req.user.id, function(err, user) {
    user.friends.push(request.data);
    user.request.splice(req.params.idx, 1);
    user.save(function(err) {
      req.flash('info', {
        msg: 'New friend has been added.'
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
            msg: 'New friend has been added.'
          });
          res.redirect('/');
        });
      });
    });
  });
});

router.get('/reject/:idx', function(req, res){
  request = req.user.request[req.params.idx];
  User.findById(req.user.id, function(err, user){
    user.request.splice(req.params.idx, 1);
    user.save(function(err) {
      req.flash('info', {
        msg: 'New friend has been rejected.'
      });
      res.redirect('/');
    });
  });
});

router.get('/find/emails/all', function(req,res){
   User.find({}, function(err, users) {
    var emails = [];
    for (var i=0; i<users.length; i++){
      if (users[i].email !== req.user.email){
        emails.push(users[i].email);
      }
    } 
    res.send(emails);
    res.end();
   });
});

router.get('/get/emails/all', function(req, res) {
  var emails = [];
  for (var i = 0; i < req.user.friends.length; i++) {
    emails.push(req.user.friends[i].email);
  }
  res.send(emails);
  res.end();
});

router.post('/find', function(req, res) {
  var email = req.body.email;
  console.log(email);
  User.findOne({
    email: email
  }, function(err, user) {
    if (!user) {
      res.send({
        error: true,
        self: false,
        request_sent_exist: false,
        request_received_exist: false,
        friend_exist: false,
        friend: {}
      });
      res.end();
    } else {
      var exist = false;
      if (req.user.email === req.body.email){
        res.send({
              error: false,
              self: true,
              request_send_exist: false,
              request_received_exist: false,
              friend_exist: false,
              friend: {}
            });
        res.end();
        exist = true;
      }
      if (!exist){
        for (var i=0; i<req.user.request.length; i++){
          if (req.user.request[i].type === 'friend_request' && req.user.request[i].data.email === req.body.email){
            res.send({
              error: false,
              self: false,
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
      } 
      if (!exist){
        for (var i=0; i<req.user.friends.length; i++){
          if (req.user.friends[i].email === user.email) {
            res.send({
              error: false,
              self: false,
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
            self: false,
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
            self: false,
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

module.exports = router;