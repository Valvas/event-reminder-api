'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createAccount = (obj, databaseConnector, callback) =>
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
          'value': obj.email
        }
      }
    }
  }, databaseConnector, (boolean, accountOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      accountOrErrorMessage.length > 0 ? callback(true) :

      databaseManager.insertQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.accounts,

        'uuid': false,

        'args':
        {
          'email': obj.email,
          'lastname': obj.lastname,
          'firstname': obj.firstname
        }
      }, databaseConnector, (boolean, insertedIdOrErrorMessage) =>
      {
        boolean == false ? callback(false, 500, constants.DATABASE_QUERY_ERROR) : callback(true);
      });
    }
  });
}

/****************************************************************************************************/