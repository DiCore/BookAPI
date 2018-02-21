var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.get('/api', function (req, res) {
  res.sendFile('./homepage.html', {root: __dirname});
});

app.get('/books', function (req, res) {
  res.sendFile('./books.html', {root: __dirname});
});

app.get('/login', function (req, res) {
  res.sendFile('./login.html', {root: __dirname});
});
//connect to MongoDB
// mongodb://azkmetat:Poznai12@cluster0-shard-00-00-jpice.mongodb.net:27017,cluster0-shard-00-01-jpice.mongodb.net:27017,cluster0-shard-00-02-jpice.mongodb.net:27017/booktest?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
mongoose.connect('mongodb://azkmetat:Poznai12@cluster0-shard-00-00-jpice.mongodb.net:27017,cluster0-shard-00-01-jpice.mongodb.net:27017,cluster0-shard-00-02-jpice.mongodb.net:27017/booktest?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + './views/login.html'));

// include routes
var routes = require('./router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});



app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
