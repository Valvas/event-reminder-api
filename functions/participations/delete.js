'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.removeParticipantFromEvent = (eventID, accountEmail, databaseConnector, callback) =>
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
        'tableName': params.database.tables.events,

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
      }, databaseConnector, (boolean, rowOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          rowOrErrorMessage.length > 0 ? callback(false, 406, constants.EVENT_CREATOR_CANNOT_BE_REMOVED_FROM_PARTICIPANTS) :

          participationsCheck.checkIfParticipationExists(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
          {
            boolean == false ? callback(false, errorStatus, errorCode) :
    
            databaseManager.deleteQuery(
            {
              'databaseName': params.database.name,
              'tableName': params.database.tables.participations,
    
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
            }, databaseConnector, (boolean, errorStatus, errorCode) =>
            {
              boolean ? callback(true) : callback(false, errorStatus, errorCode);
            });
          });
        }
      });
    });
  });
}

/****************************************************************************************************/

module.exports.removeParticipantsFromEvent = (eventID, databaseConnector, callback) =>
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
        
        databaseManager.deleteQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,

          'where':
          {
            '=':
            {
              '0':
              {
                'key': 'event_id',
                'value': eventID
              }
            }
          }
        }, databaseConnector, (boolean, errorStatus, errorCode) =>
        {
          boolean ? callback(true) : callback(false, errorStatus, errorCode);
        });
      }
    });
  });
}