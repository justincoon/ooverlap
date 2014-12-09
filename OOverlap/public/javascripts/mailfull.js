
var express = require('express');
var Mailgun = require('mailgun-js');
var app = express();


var api_key = 'key-a35505ce372dbcf1d1497174eced1ed9';

var domain = 'OOverlap.com';

var from_who = 'mg.overlap.com';

app.use(express.static(__dirname + '/js'));

app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.render('index', function(err, html) {
        if (err) {
            console.log(err); 
        }
        else { 
            res.send(html)
        };
    });
});

app.get('/submit/:mail', function(req,res) {

    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: req.params.mail,
      subject: 'Hello from OOverlap',
      html: 'Welcome to OOverlap'
    }

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }

        else {
    
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});
app.get('/forgot/:mail', function(req,res) {

    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: req.params.mail,
      subject: 'Forgotten Email',
      html: ''
    }

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        else {
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});

app.get('/Welcome/:mail', function(req,res){
    
    var path = require("path");
    var fp = path.join(__dirname, 'welcome.txt');
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: req.params.mail,
      subject: 'Welcome to OOverlap',
      text: 'Welcome to OOverlap! Please read attached letter and enjoy!',
      attachment: fp
    };


    mailgun.messages().send(data, function (error, body) {
        if (error) {
            res.render('error', {error: error});
        }
            else {
            res.send("Attachment is on its way");
            console.log("attachment sent", fp);
            }
        });
})
