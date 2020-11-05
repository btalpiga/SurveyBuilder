var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var expressStaticGzip = require("express-static-gzip");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(compression());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use( expressStaticGzip(__dirname+'/public'
// , {
//   enableBrotli: true,
//   customCompressions: [{
//       encodingName: 'deflate',
//       fileExtension: 'gz'
//   }],
//   orderPreference: ['br']
// }
//));

//app.get('*.js', function(req, res, next) {
//  req.url = req.url + '.gz';
//  res.set('Content-Encoding', 'gzip');
//  res.set('Content-Type', 'text/javascript');
//  next();
//});

//app.get('*.css', function(req, res, next) {
//  req.url = req.url + '.gz';
//  res.set('Content-Encoding', 'gzip');
//  res.set('Content-Type', 'text/css');
//  next();
//});


//app.get('/*', (req, res, next) => { 
  // res.sendFile(expressStaticGzip(path.join(__dirname, 'public', 'index.html')), { index: true }); 
  // or 
  //if(req.url=='/api/data/brands' ){
 //  next();  
//  }else{
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//  }
//});
// app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/api', apiRouter);

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
