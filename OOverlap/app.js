var express      = require('express');
var cookieParser = require('cookie-parser');
var flash        = require('express-flash');
var compress     = require('compression');
var session      = require('express-session');
var lodash       = require('lodash');
var connectmongo = require('connect-mongo')(session);
var validator    = require('express-validator');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var passport     = require('passport');

var routes       = require('./routes/index');
var auth         = require('./routes/auth');
var user         = require('./routes/user');
var app          = express();

//API Keys & Passport config

var keys = require('./config/keys');
var passConfig = require('./config/passport');

//Start mongo

mongoose.connect(keys.db);
mongoose.connection.on('error', function() { console.error('Error: is mongo running?');});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(validator());
app.use(cookieParser());
app.use(session(
{
	resave: true, 
	saveUninitialized: true, 
	secret: keys.sessionSecret, 
	store: new connectmongo({ url: keys.db, auto_reconnect: true})
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
