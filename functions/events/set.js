'use strict';

var params            = require(`${__root}/json/params`);
var format            = require(`${__root}/functions/format`);
var constants         = require(`${__root}/functions/constants`);
var eventsCheck       = require(`${__root}/functions/events/check`);
var accountsGet       = require(`${__root}/functions/accounts/get`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.setParticipationStatusToEvent = (obj, accountEmail, databaseConnector, callback) =>
{
  obj                 == undefined ||
  obj.eventId         == undefined ||
  obj.status          == undefined ||
  accountEmail        == undefined ||
  databaseConnector   == undefined ?

  callback(false, 406, constants.MISSING_DATA_IN_QUERY) :

  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    if(accountOrFalse == false) callback(false, errorStatus, errorCode);

    else
    {
      if(obj.status != params.participationStatus.WAITING && obj.status != params.participationStatus.ACCEPTED && obj.status != params.participationStatus.REJECTED)
      {
        callback(false, 406, constants.PARTICIPATION_STATUS_NOT_AUTHORIZED);
      }

      else
      {
        accountOrFalse == false ? callback(false, errorStatus, errorCode) :

        eventsCheck.checkIfEventExists(obj.eventId, databaseConnector, (boolean, errorStatus, errorCode) =>
        {
          boolean == false ? callback(false, errorStatus, errorCode) :

          databaseManager.updateQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.participations,
            'args': { 'status': obj.status },
            'where': { '0': { 'operator': 'AND', '0':{ 'operator': '=', '0': { 'key': 'account_email', 'value': accountEmail }, '1': { 'key': 'event_id', 'value': obj.eventId } } } }

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
      }
    }
  });
}

/****************************************************************************************************/

module.exports.updateEvent = (obj, accountEmail, databaseConnector, callback) =>
{
  format.checkEventDataAndFormat(obj, accountEmail, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(obj.id, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      eventsCheck.checkIfEmailIsEventCreatorEmail(obj.id, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
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
          'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': obj.id } } }
 
        }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
        {
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
  });
}

/****************************************************************************************************/