'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var participationsDelete      = require(`${__root}/functions/participations/delete`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteEvent = (eventID, databaseConnector, callback) =>
{
  participationsDelete.removeParticipantsFromEvent(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
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
    }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
    {
      boolean ? callback(true) : callback(false, errorStatus, errorCode);
    });
  });
}

/****************************************************************************************************/
