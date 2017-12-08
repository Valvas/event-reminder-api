'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.checkIfParticipationExists = (eventID, accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.participations,
  
    'args':
    {
      '0': 'id'
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
      participationOrErrorMessage.length == 0 ? callback(true) : callback(false, 406, constants.ALREADY_A_PARTICIPANT);
    }
  });
}

/****************************************************************************************************/