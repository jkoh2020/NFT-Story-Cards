var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require('dotenv');

const storyRoutes = require('./routes/story');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superAdmin');

const mongoose = require('mongoose');

dotenv.config();
var app = express();

// Create Connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const con = mongoose.connection;

// Check connection
con.on('open', () => {
  console.log('Database is connected');
});

  app.use(cors());
  app.use(logger('dev'));



app.use((req,res,next)=>{
  res.setHeader('Acces-Control-Allow-Origin','*');
  res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
  next(); 
})

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', storyRoutes);
app.use('/admin', adminRoutes);
app.use('/super-admin', superAdminRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
 app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
}); 

module.exports = app;
