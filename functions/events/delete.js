'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteEvent = (eventID, databaseConnector, callback) =>
{
  eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    databaseManager.selectQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.events,

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
            'key': 'id',
            'value': eventID
          }
        }
      }
    }, databaseConnector, (boolean, rowOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        rowOrErrorMessage.length > 0 ? callback(false, 406, constants.EVENT_NOT_FOUND) :

        eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
        {
          boolean == false ? callback(false, errorStatus, errorCode) :
  
          databaseManager.deleteQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.events,
  
            'where':
            {
              '=':
              {
                '0':
                {
                  'key': 'id',
                  'value': eventID
                }
              }
            }
          }, databaseConnector, (boolean, errorStatus, errorCode) =>
          {
            boolean ? callback(true) : callback(false, errorStatus, errorCode);
          });
        });
      }
    });
  });
}

/****************************************************************************************************/