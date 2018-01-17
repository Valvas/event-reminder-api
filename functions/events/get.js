'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var accountsGet       = require(`${__root}/functions/accounts/get`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getEvents = (accountEmail, databaseConnector, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :
    
    databaseManager.selectQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.participations,  
      'args': { '0': 'event_id' },    
      'where': { '0': { 'operator': '=', '0': { 'key': 'account_email', 'value': accountEmail } } }
    
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
              'args': { '0': '*' },          
              'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': rowsOrErrorMessage[x].event_id } } }
 
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
  });
}

/****************************************************************************************************/

module.exports.getParticipantsToEvent = (eventID, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.participations,
    'args': { '0': 'account_email', '1': 'status' },
    'where': { '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventID } } }

  }, databaseConnector, (boolean, participantsOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      if(participantsOrErrorMessage.length == 0) callback({});

      else
      {
        var x = 0, obj = {};

        var accountLoop = () =>
        {
          databaseManager.selectQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.accounts,  
            'args': { '0': '*' },        
            'where': { '0': { 'operator': '=', '0': { 'key': 'email', 'value': participantsOrErrorMessage[x].account_email } } }
      
          }, databaseConnector, (boolean, accountOrErrorMessage) =>
          {
            if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

            else
            {
              obj[x] = {};
              obj[x] = accountOrErrorMessage[0];
              obj[x].status = {};
              obj[x].status = participantsOrErrorMessage[x].status

              participantsOrErrorMessage[x += 1] == undefined ? callback(obj) : accountLoop();
            }
          });
        }

        accountLoop();
      }
    }
  });
}

/****************************************************************************************************/