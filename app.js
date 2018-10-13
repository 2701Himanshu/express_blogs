var createError = require('http-errors');
var express = require('express');
var path = require('path');
global.appRoot = path.resolve(__dirname);
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('express-dot-engine');
var mongoDB = require('./mongoDB');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
mongoDB.connectToServer( function( err ) {
	console.log('Connection Successfull.');
});

// view engine setup
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
