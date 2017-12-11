'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createParticipation = (eventID, accountEmail, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      participationsCheck.checkIfParticipationDoNotAlreadyExists(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        boolean == false ? callback(false, errorStatus, errorCode) :
    
        databaseManager.insertQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,
        
          'uuid': false,
        
          'args':
          {
            'event_id': eventID,
            'account_email': accountEmail,
            'status': 0
          }
        }, databaseConnector, (boolean, idOrErrorMessage) =>
        {
          boolean ? callback(true) : callback(false, 500, constants.DATABASE_QUERY_ERROR);
        });
      });
    });
  });
}

/****************************************************************************************************/