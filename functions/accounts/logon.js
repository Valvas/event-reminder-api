'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var accountsCheck     = require(`${__root}/functions/accounts/check`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createAccount = (obj, databaseConnector, callback) =>
{
  obj.email == undefined || obj.firstname == undefined || obj.lastname == undefined ?
  
  callback(false, 404, constants.MISSING_DATA_IN_QUERY) :

  accountsCheck.checkIfAccountExists(obj.email, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    if(boolean == false && errorStatus == 500) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else if(boolean == true) callback(true);

    else
    {
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