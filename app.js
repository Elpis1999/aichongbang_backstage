var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var servicerRouter = require('./routes/service');
var orderRouter = require('./routes/order');


var storeRouter = require('./routes/store');
var petmasterRouter = require('./routes/petmaster');
var supGodsRouter = require('./routes/suppilergoods');
var goodsRouter = require('./routes/goods');

var suppilerRouter = require('./routes/suppiler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());


app.use(session({
  secret: "aichongbang",
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/service', servicerRouter);
app.use('/store', storeRouter);
app.use('/petmaster', petmasterRouter);
app.use('/order', orderRouter);

app.use('/supGods', supGodsRouter);
app.use('/goods', goodsRouter);
app.use('/suppiler', suppilerRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;