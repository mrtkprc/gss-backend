const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const telegramBot = require('./helpers/telegram_bot/bot_server');

const indexRouter = require('./routes/index');
const sensorsRouter = require('./routes/sensors');
const geriatricRouter = require('./routes/geriatrics');
const relativeRouter = require('./routes/relatives');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//db connection
const db = require('./helpers/db');
db();
// config.js
const config = require('./config');

//verify Token
const verifyToken = require('./middleware/verify-token');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('API_SECRET_KEY',config.api_secret_key);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/sensor/',verifyToken,sensorsRouter);
app.use('/api/geriatric/',verifyToken,geriatricRouter);
app.use('/api/relative/',verifyToken,relativeRouter);


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
