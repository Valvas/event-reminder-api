'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getParticipationStatus = (eventID, accountEmail, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.selectQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,

        'args':
        {
          '0': 'status'
        },

        'where':
        {
          'AND':
          {
            '=':
            {
              '0':
              {
                'key': 'event_id',
                'value': eventID
              },

              '1':
              {
                'key': 'account_email',
                'value': accountEmail
              }
            }
          }
        }
      }, databaseConnector, (boolean, participationOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          participationOrErrorMessage.length == 0 ? 
          callback(false, 406, constants.NOT_A_PARTICIPANT_OF_CURRENT_EVENT) :
          callback(participationOrErrorMessage[0].status);
        }
      });
    });
  });
}

/****************************************************************************************************/