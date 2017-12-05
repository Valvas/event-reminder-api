'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getEvents = (accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.accounts,

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
          'key': 'email',
          'value': accountEmail
        }
      }
    }
  }, databaseConnector, (boolean, rowsOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      rowsOrErrorMessage.length == 0 ? callback(false, 406, constants.ACCOUNT_NOT_FOUND) :

      databaseManager.selectQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,
    
        'args':
        {
          '0': 'event_id'
        },
    
        'where':
        {
          '=':
          {
            '0':
            {
              'key': 'account_email',
              'value': accountEmail
            }
          }
        }
      }, databaseConnector, (boolean, rowsOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          if(rowsOrErrorMessage.length == 0) callback({});

          else
          {
            var x = 0, obj ={};

            var eventLoop = () =>
            {
              databaseManager.selectQuery(
              {
                'databaseName': params.database.name,
                'tableName': params.database.tables.events,
            
                'args':
                {
                  '0': '*'
                },
            
                'where':
                {
                  '=':
                  {
                    '0':
                    {
                      'key': 'id',
                      'value': rowsOrErrorMessage[x].event_id
                    }
                  }
                }
              }, databaseConnector, (boolean, eventOrErrorMessage) =>
              {
                if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

                else
                {
                  obj[x] = {};
                  obj[x] = eventOrErrorMessage[0];

                  rowsOrErrorMessage[x += 1] == undefined ? callback(obj) : eventLoop();
                }
              });
            }

            eventLoop();
          }
        }
      });
    }
  });
}

/****************************************************************************************************/