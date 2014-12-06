var express     = require('express');
var router      = express.Router();
var flash       = require('express-flash');
var User        = require('../lib/user');

var add_friend;

//This route is to send a new friend request from a user to another
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

//This route is to accept friend request
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

//This route is to reject friend request
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

//This route is to find an account when user want to add a friend
router.post('/find', function(req, res) {
  var email = req.body.email;
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

//This route is to unfriend an account
router.post('/unfriend', function(req, res) {
  User.findById(req.user.id, function(err, user) {
    for(var i=user.request.length-1; i>=0; i--){
      if (user.request[i].from === req.body.email){
        user.request.splice(i,1);
      }
    }
    for(var i=user.friends.length-1; i>=0; i--){
      if (user.friends[i].email === req.body.email){
        user.friends.splice(i,1);
        break;
      }
    }
    user.save(function(err) {
      req.flash('info', {
        msg: 'Friend has been removed.'
      });
    });
  });
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    for(var i=user.request.length-1; i>=0; i--){
      if (user.request[i].from === req.user.email){
        user.request.splice(i,1);
      }
    }
    for(var i=user.friends.length-1; i>=0; i--){
      if (user.friends[i].email === req.user.email){
        user.friends.splice(i,1);
        break;
      }
    }
    user.save(function(err) {
      req.flash('info', {
        msg: 'Friend has been removed.'
      });
    });
  });
  res.end();
});


//This route is to get all emails to add friend (for typeahead suggestion)
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

//This route is to get all friend email to send meeting request (for typeahead suggestion)
router.get('/get/emails/all', function(req, res) {
  var emails = [];
  for (var i = 0; i < req.user.friends.length; i++) {
    emails.push(req.user.friends[i].email);
  }
  res.send(emails);
  res.end();
});

//This route is to get all current friends
router.get('/get/all', function(req,res){
  res.send(req.user.friends);
  res.end();
});

module.exports = router;
