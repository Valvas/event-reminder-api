'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteNotificationToken = (notificationToken, databaseConnector, callback) =>
{
  databaseManager.deleteQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.notifications,
    'where': { '0': { 'operator': '=', '0': { 'key': 'token', 'value': notificationToken } } }
    
  }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
  {
    boolean == false ? callback(false, 500, constants.DATABASE_QUERY_ERROR) : callback(true);
  });
}

/****************************************************************************************************/