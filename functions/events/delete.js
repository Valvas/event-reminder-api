'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsGet                 = require(`${__root}/functions/events/get`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var eventsUpdate              = require(`${__root}/functions/events/update`);
var notificationsSend         = require(`${__root}/functions/notifications/send`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var participationsDelete      = require(`${__root}/functions/participations/delete`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteEvent = (eventID, accountEmail, databaseConnector, sender, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    eventsGet.getEventUsingID(eventID, databaseConnector, (eventOrFalse, errorStatus, errorCode) =>
    {
      eventOrFalse == false ? callback(false, errorStatus, errorCode) :

      eventsGet.getParticipantsToEvent(eventID, databaseConnector, (participantsOrFalse, errorStatus, errorCode) =>
      {
        typeof(participantsOrFalse) == 'boolean' && participantsOrFalse == false ? callback(false, errorStatus, errorCode) :
  
        participationsDelete.removeParticipantsFromEvent(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
        {
          boolean == false ? callback(false, errorStatus, errorCode) :
            
          databaseManager.deleteQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.events,
            'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': eventID } } }
    
          }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
          {
            if(boolean == false) callback(false, errorStatus, errorCode);
  
            else
            {
              var x = 0;
  
              var loop = () =>
              {
                notificationsSend.eventIsDeleted(sender, eventOrFalse, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
                {
                  if(boolean == false) console.log(`Error [${errorStatus}] - ${errorMessage} !`);

                  participantsOrFalse[x += 1] == undefined ? callback(true) : loop();
                });
              }
  
              participantsOrFalse[x] == undefined ? callback(true) : loop();
            }
          });
        });
      });
    });
  });
}

/****************************************************************************************************/

module.exports.cancelEvent = (eventID, accountEmail, databaseConnector, sender, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    eventsGet.getEventUsingID(eventID, databaseConnector, (eventOrFalse, errorStatus, errorCode) =>
    {
      if(eventOrFalse == false) callback(false, errorStatus, errorCode);

      else
      {
        eventOrFalse.is_ponctual == '1' ? callback(true) :

        eventsGet.getParticipantsToEvent(eventID, databaseConnector, (participantsOrFalse, errorStatus, errorCode) =>
        {
          typeof(participantsOrFalse) == 'boolean' && participantsOrFalse == false ? callback(false, errorStatus, errorCode) :

          eventsUpdate.updateEventDateUsingCycle(eventOrFalse, databaseConnector, sender, (boolean, errorStatus, errorMessage) =>
          {
            boolean == false ? callback(false, errorStatus, constants.COULD_NOT_UPDATE_EVENT_DATE) : callback(true);
          });
        });
      }
    });
  });
}

/****************************************************************************************************/
