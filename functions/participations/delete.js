'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.removeParticipantFromEvent = (eventID, accountEmail, participantEmail, databaseConnector, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    accountsGet.getAccountUsingEmail(participantEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
    {
      accountOrFalse == false ? callback(false, errorStatus, errorCode) :

      eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        boolean == false ? callback(false, errorStatus, errorCode) :

        databaseManager.selectQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.events,
          'args': { '0': 'id' },
          'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'id', 'value': eventID }, '1': { 'key': 'account_email', 'value': participantEmail } } } }

        }, databaseConnector, (boolean, rowOrErrorMessage) =>
        {
          if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

          else
          {
            rowOrErrorMessage.length > 0 ? callback(false, 406, constants.EVENT_CREATOR_CANNOT_BE_REMOVED_FROM_PARTICIPANTS) :

            participationsCheck.checkIfParticipationExists(eventID, participantEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
            {
              boolean == false ? callback(false, errorStatus, errorCode) :
      
              databaseManager.deleteQuery(
              {
                'databaseName': params.database.name,
                'tableName': params.database.tables.participations,
                'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventID }, '1': { 'key': 'account_email', 'value': participantEmail } } } }

              }, databaseConnector, (boolean, errorStatus, errorCode) =>
              {
                boolean ? callback(true) : callback(false, errorStatus, errorCode);
              });
            });
          }
        });
      });
    });
  });
}

/****************************************************************************************************/

module.exports.removeParticipantsFromEvent = (eventID, accountEmail, databaseConnector, callback) =>
{
  eventsCheck.checkIfEmailIsEventCreatorEmail(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.deleteQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,
        'where': { '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventID } } }

      }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
      {
        boolean ? callback(true) : callback(false, 500, constants.DATABASE_QUERY_ERROR);
      });
    });
  });
}

/****************************************************************************************************/
