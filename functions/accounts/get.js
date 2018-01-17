'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getAccountUsingEmail = (emailAddress, databaseConnector, callback) =>
{
  emailAddress == undefined || databaseConnector == undefined ? callback(false, 406, constants.MISSING_DATA_IN_QUERY) :

  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.accounts,
    'args': { '0': '*' },
    'where': { '0': { 'operator': '=', '0': { 'key': 'email', 'value': emailAddress } } }

  }, databaseConnector, (boolean, accountOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      accountOrErrorMessage.length == 0 ? 
      callback(false, 404, constants.ACCOUNT_NOT_FOUND) : 
      callback(accountOrErrorMessage[0]);
    }
  });
}

/****************************************************************************************************/