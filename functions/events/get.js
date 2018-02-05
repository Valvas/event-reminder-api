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
      'args': { '0': '*' },    
      'where': { '0': { 'operator': '=', '0': { 'key': 'account_email', 'value': accountEmail } } }
    
    }, databaseConnector, (boolean, rowsOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        if(rowsOrErrorMessage.length == 0) callback([]);

        else
        {
          var x = 0, obj = [];

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
                accountsGet.getAccountUsingEmail(eventOrErrorMessage[0].account_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
                {
                  if(accountOrFalse == false) callback(false, errorStatus, errorCode);

                  else
                  {
                    obj[x] = {};
                    
                    obj[x]['id']          = eventOrErrorMessage[0]['id'];
                    obj[x]['name']        = eventOrErrorMessage[0]['name'];
                    obj[x]['date']        = eventOrErrorMessage[0]['date'];
                    obj[x]['days']        = eventOrErrorMessage[0]['cycle_days'];
                    obj[x]['years']       = eventOrErrorMessage[0]['cycle_years'];
                    obj[x]['hours']       = eventOrErrorMessage[0]['cycle_hours'];
                    obj[x]['description'] = eventOrErrorMessage[0]['description'];
                    obj[x]['months']      = eventOrErrorMessage[0]['cycle_months'];
                    obj[x]['minutes']     = eventOrErrorMessage[0]['cycle_minutes'];
                    obj[x]['ponctual']    = eventOrErrorMessage[0]['is_ponctual'] == 1 ? true : false;
                    obj[x]['status']      = rowsOrErrorMessage[x].status;

                    obj[x]['account'] = accountOrFalse;

                    rowsOrErrorMessage[x += 1] == undefined ? callback(obj) : eventLoop();
                  }
                });
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
      if(participantsOrErrorMessage.length == 0) callback([]);

      else
      {
        var x = 0, array = [];

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
              array[x] = {};
              array[x] = accountOrErrorMessage[0];
              array[x].status = participantsOrErrorMessage[x].status

              participantsOrErrorMessage[x += 1] == undefined ? callback(array) : accountLoop();
            }
          });
        }

        accountLoop();
      }
    }
  });
}

/****************************************************************************************************/

module.exports.getEventUsingID = (eventID, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.events,
    'args': { '0': '*' },          
    'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': eventID } } }

  }, databaseConnector, (boolean, eventOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      eventOrErrorMessage.length == 0 ? callback(false, 404, constants.EVENT_NOT_FOUND) : callback(eventOrErrorMessage[0]);
    }
  });
}

/****************************************************************************************************/