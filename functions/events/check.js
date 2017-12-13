'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.checkIfEventExists = (eventID, databaseConnector, callback) =>
{
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
  }, databaseConnector, (boolean, eventOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);
  
    else
    {
      eventOrErrorMessage.length == 0 ? callback(false, 406, constants.EVENT_NOT_FOUND) : callback(true);
    }
  });
}

/****************************************************************************************************/

module.exports.checkIfEmailIsEventCreatorEmail = (eventID, accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.events,
  
    'args':
    {
      '0': 'id',
      '1': 'account_email'
    },
  
    'where':
    {
      'AND':
      {
        '=':
        {
          '0':
          {
            'key': 'id',
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
  }, databaseConnector, (boolean, eventOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);
  
    else
    {
      eventOrErrorMessage.length == 0 ? callback(false, 406, constants.ACCOUNT_EMAIL_IS_NOT_EVENT_CREATOR_EMAIL) : callback(true);
    }
  });
}

/****************************************************************************************************/
