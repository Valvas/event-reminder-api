'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsGet                 = require(`${__root}/functions/events/get`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var notificationsSend         = require(`${__root}/functions/notifications/send`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createParticipation = (eventID, accountEmail, databaseConnector, sender, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    eventsGet.getEventUsingID(eventID, databaseConnector, (eventOrFalse, errorStatus, errorCode) =>
    {
      eventOrFalse == false ? callback(false, errorStatus, errorCode) :

      participationsCheck.checkIfParticipationDoNotAlreadyExists(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        boolean == false ? callback(false, errorStatus, errorCode) :
    
        databaseManager.insertQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,   
          'uuid': false,        
          'args': { 'event_id': eventID, 'account_email': accountEmail, 'status': params.participationStatus.WAITING }
          
        }, databaseConnector, (boolean, idOrErrorMessage) =>
        {
          if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

          else
          {
            notificationsSend.invitedToParticipateToEvent(sender, eventOrFalse, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
            {
              if(boolean == false) console.log(`Error [${errorStatus}] - ${errorMessage} !`);

              callback(true);
            });
          }
        });
      });
    });
  });
}

/****************************************************************************************************/