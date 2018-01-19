global.__root = __dirname;

var path                  = require('path');
var mysql                 = require('mysql');
var logger                = require('morgan');
var express               = require('express');
var gcm                   = require('node-gcm');
var bodyParser            = require('body-parser');
var params                = require('./json/params');
var token                 = require('./functions/token');
var drone                 = require('./functions/drone');
var databaseInit          = require('./functions/database/init');

var events                = require('./routes/events');
var friends               = require('./routes/friends');
var accounts              = require('./routes/accounts');
var participations        = require('./routes/participations');

var publicAccounts        = require('./routes/public/accounts');

var connector = mysql.createConnection(
{
  host     : params.database.host,
  user     : params.database.user,
  password : params.database.password
});
 
var sender = new gcm.Sender('AAAAmekFs6Y:APA91bECVn03td4aY4N0z406-BtnL5VGDiIjY8zsR1nAK8oHnrcQdwDqu7NkLnM7_J3WtGcK9uTxPLobvI7C5o-19tSVtD-p5zPPTcIHecYgspguATiLbgCHI7LJbMxPEOpiA9GnUfKM');

/*var message = new gcm.Message(
{
    data: { key1: 'test message' }
});
 
var regTokens = ['registrationToken'];
 
sender.send(message, { registrationTokens: regTokens }, (err, response) =>
{
    if(err) console.error(err);
    else console.log(response);
});*/

var app = express();

app.set('tokenSecret', params.secret);
app.set('notificationSender', sender);
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
    drone.getStartingEventsInAnHour(connector, sender);
    drone.getStartingEvents(connector, sender);

    setTimeout(() => { loop(); }, 1000);
  }

  loop();
});

module.exports = app;
