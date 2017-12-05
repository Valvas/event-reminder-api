global.__root = __dirname;

var path                  = require('path');
var mysql                 = require('mysql');
var logger                = require('morgan');
var express               = require('express');
var bodyParser            = require('body-parser');
var params                = require('./json/params');
var databaseInit          = require('./functions/database/init');

var events                = require('./routes/events');

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

databaseInit.createDatabases(connector, (boolean, message) =>
{
  console.log(message);
});

module.exports = app;
