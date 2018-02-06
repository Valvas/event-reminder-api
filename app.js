global.__root = __dirname;

var path                  = require('path');
var mysql                 = require('mysql');
var logger                = require('morgan');
var express               = require('express');
var bodyParser            = require('body-parser');
var params                = require('./json/params');
var firebase              = require('firebase-admin');
var serviceAccount        = require('./json/key.json');
var token                 = require('./functions/token');
var drone                 = require('./functions/drone');
var databaseInit          = require('./functions/database/init');

var events                = require('./routes/events');
var friends               = require('./routes/friends');
var accounts              = require('./routes/accounts');
var participations        = require('./routes/participations');

var publicAccounts        = require('./routes/public/accounts');

firebase.initializeApp(
{
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://event-reminder-3acda.firebaseio.com'
});

var connector = mysql.createConnection(
{
  host     : params.database.host,
  user     : params.database.user,
  password : params.database.password
});

var app = express();

app.set('tokenSecret', params.secret);
app.set('notificationSender', firebase);
app.set('databaseConnector', connector);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public/accounts', publicAccounts);

app.use('/events', token, events);
app.use('/friends', token, friends);
app.use('/accounts', token, accounts);
app.use('/participations', token, participations);

databaseInit.createDatabases(connector, () => 
{
  var loop = () =>
  {
    drone.getStartingEventsInAnHour(connector, firebase);
    drone.getStartingEvents(connector, firebase);

    setTimeout(() => { loop(); }, 1000);
  }

  loop();
});

module.exports = app;
