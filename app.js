const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const config = require('./config/database');
global._ = require('underscore');

mongoose.connect(config.database);
let db = mongoose.connection;

//check connection
db.once('open',function(){
  console.log('Connected to mongodb');
});

//Check for Db errors
db.on('error',function(err){
  console.log(err);
});

//init app
const app=express();

//Bring in models
let Article = require('./models/article');
let Topic = require('./models/topic');


//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug')

// Body parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true

}));

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//EXpress Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// PAssport config
require('./config/passport')(passport);

// PAssport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//home route
app.get('/',async function(req, res){
  await Topic.find({},function(err,topics){
    if (err) {
      console.log(err);
    }else {
      res.render('index_topic',{
        title:'Kindly add new topics for discussion',
        topics:topics
      });
    }
  });
});

// Route files
app.use('/articles',require('./routes/articles'));
app.use('/users',require('./routes/users'));
app.use('/posts',require('./routes/posts'));
app.use('/topic',require('./routes/topic'));
app.use('/comment',require('./routes/comments'));

//start server
app.listen(3000, function()
{
  console.log('Server started on 3000...')

});
