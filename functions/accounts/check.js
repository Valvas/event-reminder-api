'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.checkIfAccountExists = (accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.accounts,

    'args':
    {
      '0': 'id'
    },

    'where':
    {
      '=':
      {
        '0':
        {
          'key': 'email',
          'value': accountEmail
        }
      }
    }
  }, databaseConnector, (boolean, accountOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      accountOrErrorMessage.length == 0 ? callback(false, 406, constants.ACCOUNT_NOT_FOUND) : callback(true);
    }
  });
}

/****************************************************************************************************/

module.exports.checkIfAccountExists = (accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.accounts,

    'args':
    {
      '0': 'id'
    },

    'where':
    {
      '=':
      {
        '0':
        {
          'key': 'email',
          'value': accountEmail
        }
      }
    }
  }, databaseConnector, (boolean, accountOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      accountOrErrorMessage.length == 0 ? callback(false, 406, constants.ACCOUNT_NOT_FOUND) : callback(true);
    }
  });
}

/****************************************************************************************************/