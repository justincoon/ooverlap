var express     = require('express');
var router      = express.Router();
var gcal        = require('google-calendar');
var refresh     = require('google-refresh-token');
var flash       = require('express-flash');
var keys        = require('../config/keys.js');
var User        = require('../lib/user');
var nodemailer  = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ooverlap.team.undefined@gmail.com',
        pass: 'ooverlap'
    }
});

router.get('/', function(req,res){
  res.redirect('/');
});

router.get('/test', function(req,res) {
	var mailOptions = {
    		from: 'ooverlap.team.undefined@gmail.com', // sender address
    		to: 'justin.tyler.coon@gmail.com', // list of receivers
    		subject: 'Hello ✔', // Subject line
    		text: 'Hello world ✔', // plaintext body
    		html: '<b>Hello world ✔</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
});

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
  if (req.user && req.user.tokens[0].refreshToken) {
    refresh(req.user.tokens[0].refreshToken, keys.google.clientID, keys.google.clientSecret, function(err, json, result) {
      User.findById(req.user.id, function(err, user) {
        user.tokens.splice(0, 1);
        user.tokens.push({
          kind: 'google',
          accessToken: json.accessToken,
          refreshToken: req.user.tokens[0].refreshToken
        });
        var google_calendar = new gcal.GoogleCalendar(user.tokens[0].accessToken);
        var timeMin = new Date();
        var timeMax = new Date();
        timeMax.setFullYear(timeMin.getFullYear()+1);
        google_calendar.events.list(user.email, {
          'timeMin': timeMin.toISOString(),
          'timeMax': timeMax.toISOString(),
          'singleEvents': true
        }, function(err, calendarList) {
          if (err){
            console.log(err);
          } else {
            user.schedule = calendarList.items;
            user.save(function(err) {
              if (err){
                console.log(err);
              }
              req.flash('info', {
                msg: 'Schedule has been saved.'
              });
              res.redirect('/');
            });
          }
        });
      });
    });
  } else {
    res.redirect('/');
  }
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

router.get('/group', function(req, res) {
  if (req.user) {
    res.render('group', {
      user: req.user,
    });
  } else {
    res.redirect('/');
  }
});

router.get('/checkpassword', function(req, res) {
	User.findById(req.user.id, function(err, user) {
		user.comparePassword(req.body.data, function(err, success) {
			res.end(success);
		});
	});
});

router.post('/changesettings', function(req, res) {
	User.findById(req.user.id, function(err, user) {
		if(req.body.profilePicPrivacy)
			user.profilePicPrivacy = req.body.profilePicPrivacy;
		if(req.body.emailPrivacy)
			user.emailPrivacy = req.body.emailPrivacy;
		if(req.body.profPic)
			user.profile.picture = req.body.profPic;
		if(req.body.name)
			user.profile.name = req.body.name;
		if(req.body.email)
			user.email = req.body.email;
		if(req.body.newPassword)
			user.password = req.body.newPassword;
		user.save(function(err) {
		if (err){
			console.log(err);
		}
			req.flash('info', {
				msg: 'Settings have been saved.'
			});
		});
		res.end();
	});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
