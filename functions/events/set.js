'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var eventsCheck       = require(`${__root}/functions/events/check`);
var accountsCheck     = require(`${__root}/functions/accounts/check`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.setParticipationStatusToEvent = (obj, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(obj.accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(obj.eventId, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.updateQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,

        'args':
        {
          'status': obj.status
        },

        'where':
        {
          'AND':
          {
            '=':
            {
              '0':
              {
                'key': 'account_email',
                'value': obj.accountEmail
              },

              '1':
              {
                'key': 'event_id',
                'value': obj.eventId
              }
            }
          }
        }
      }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          updatedRowsOrErrorMessage == 0 ? 
          callback(false, 406, constants.NOT_A_PARTICIPANT_OF_CURRENT_EVENT) :
          callback(true);
        }
      });
    });
  });
}

/****************************************************************************************************/