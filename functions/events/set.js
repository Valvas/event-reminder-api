'use strict';

var params            = require(`${__root}/json/params`);
var format            = require(`${__root}/functions/format`);
var constants         = require(`${__root}/functions/constants`);
var eventsCheck       = require(`${__root}/functions/events/check`);
var accountsCheck     = require(`${__root}/functions/accounts/check`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.setParticipationStatusToEvent = (obj, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(obj.accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(obj.eventId, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.updateQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,

        'args':
        {
          'status': obj.status
        },

        'where':
        {
          'AND':
          {
            '=':
            {
              '0':
              {
                'key': 'account_email',
                'value': obj.accountEmail
              },

              '1':
              {
                'key': 'event_id',
                'value': obj.eventId
              }
            }
          }
        }
      }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          updatedRowsOrErrorMessage == 0 ? 
          callback(false, 406, constants.NOT_A_PARTICIPANT_OF_CURRENT_EVENT) :
          callback(true);
        }
      });
    });
  });
}

/****************************************************************************************************/

module.exports.updateEvent = (obj, databaseConnector, callback) =>
{
  format.checkEventDataAndFormat(obj, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEmailIsEventCreatorEmail(obj.id, obj.accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :
      
      databaseManager.updateQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.events,
  
          'args':
          {
            'date': obj.date,
            'is_ponctual': obj.isPonctual ? 1 : 0,
            'cycle_years': obj.timeCycle.years,
            'cycle_months': obj.timeCycle.months,
            'cycle_days': obj.timeCycle.days,
            'cycle_hours': obj.timeCycle.hours,
            'name': obj.name,
            'description': obj.description
          },
  
          'where':
          {
            '=':
            {
              '0':
              {
                'key': 'id',
                'value': obj.id
              }
            }
          }
        }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
        {
          console.log(updatedRowsOrErrorMessage);
          if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);
  
          else
          {
            updatedRowsOrErrorMessage == 0 ? 
            callback(false, 406, constants.EVENT_NOT_FOUND) :
            callback(true);
          }
        });
    });
  });
}

/****************************************************************************************************/