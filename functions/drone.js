'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getStartingEventsInAnHour = (databaseConnector, sender) =>
{
  var date = new Date(Date.now());
  date.setMilliseconds(0);

  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.events,
    'args': { '0': '*' },
    'where': { '0': { 'operator': '=', '0': { 'key': 'date', 'value': date.getTime() + 3600000 } } }

  }, databaseConnector, (boolean, eventsOrErrorMessage) =>
  {
    if(boolean)
    {
      var x = 0;

      var eventsLoop = () =>
      {
        databaseManager.selectQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,
          'args': { '0': '*' },
          'where': { '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventsOrErrorMessage[x]['id'] } } }
          
        }, databaseConnector, (boolean, participationsOrErrorMessage) =>
        {
          if(boolean)
          {
            var y = 0;

            var participationsLoop = () =>
            {
              console.log(`SENDING NOTIFICATION TO : "${participationsOrErrorMessage[y]['account_email']}" (EVENT IS STARTING IN AN HOUR) !`);
            
              if(participationsOrErrorMessage[y += 1] != undefined) participationsLoop();

              else
              {
                if(eventsOrErrorMessage[x += 1] != undefined) eventsLoop();
              }
            }

            if(Object.keys(participationsOrErrorMessage).length > 0) participationsLoop();
          }
        });
      }

      if(Object.keys(eventsOrErrorMessage).length > 0) eventsLoop();
    }
  });
};

/****************************************************************************************************/

module.exports.getStartingEvents = (databaseConnector, sender) =>
{
  var date = new Date(Date.now());
  date.setMilliseconds(0);

  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.events,
    'args': { '0': '*' },
    'where': { '0': { 'operator': '=', '0': { 'key': 'date', 'value': date.getTime() } } }

  }, databaseConnector, (boolean, eventsOrErrorMessage) =>
  {
    if(boolean)
    {
      var x = 0;

      var eventsLoop = () =>
      {
        databaseManager.selectQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,
          'args': { '0': '*' },
          'where': { '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventsOrErrorMessage[x]['id'] } } }
          
        }, databaseConnector, (boolean, participationsOrErrorMessage) =>
        {
          if(boolean)
          {
            var y = 0;

            var participationsLoop = () =>
            {
              console.log(`SENDING NOTIFICATION TO : "${participationsOrErrorMessage[y]['account_email']}" (EVENT IS STARTING NOW) !`);
            
              if(participationsOrErrorMessage[y += 1] != undefined) participationsLoop();

              else
              {
                if(eventsOrErrorMessage[x += 1] != undefined) eventsLoop();
              }
            }

            if(Object.keys(participationsOrErrorMessage).length > 0) participationsLoop();
          }
        });
      }

      if(Object.keys(eventsOrErrorMessage).length > 0) eventsLoop();
    }
  });
};

/****************************************************************************************************/