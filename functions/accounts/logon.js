'use strict';

var jwt               = require('jsonwebtoken');
var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var accountsGet       = require(`${__root}/functions/accounts/get`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createAccount = (obj, tokenSecret, databaseConnector, callback) =>
{
  obj.email == undefined || obj.firstname == undefined || obj.lastname == undefined ?
  
  callback(false, 404, constants.MISSING_DATA_IN_QUERY) :

  accountsGet.getAccountUsingEmail(obj.email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    if(accountOrFalse == false && errorStatus == 500) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else if(accountOrFalse == false && errorStatus == 404)
    {
      databaseManager.insertQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.accounts,
        'uuid': false,
        'args': { 'email': obj.email, 'firstname': obj.firstname, 'lastname': obj.lastname }

      }, databaseConnector, (boolean, insertedIdOrErrorMessage) =>
      {
        boolean == false ? callback(false, 500, constants.DATABASE_QUERY_ERROR) :

        callback(jwt.sign({ email: obj.email }, tokenSecret, { expiresIn: 60 * 60 * 24 }));
      });
    }

    else
    {
      callback(jwt.sign({ email: obj.email }, tokenSecret, { expiresIn: 60 * 60 * 24 }));
    }
  });
}

/****************************************************************************************************/