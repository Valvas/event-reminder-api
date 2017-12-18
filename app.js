global.__root = __dirname;

var path                  = require('path');
var mysql                 = require('mysql');
var logger                = require('morgan');
var express               = require('express');
var bodyParser            = require('body-parser');
var params                = require('./json/params');
var databaseInit          = require('./functions/database/init');

var events                = require('./routes/events');
var friends               = require('./routes/friends');
var accounts              = require('./routes/accounts');
var participations        = require('./routes/participations');

var connector = mysql.createConnection(
{
  host     : params.database.host,
  user     : params.database.user,
  password : params.database.password
});

var app = express();

app.set('databaseConnector', connector);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/events', events);
app.use('/friends', friends);
app.use('/accounts', accounts);
app.use('/participations', participations);

databaseInit.createDatabases(connector, () =>
{

});

module.exports = app;
