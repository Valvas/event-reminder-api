'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var participationsDelete      = require(`${__root}/functions/participations/delete`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteEvent = (eventID, accountEmail, databaseConnector, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEmailIsEventCreatorEmail(eventID, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      participationsDelete.removeParticipantsFromEvent(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        boolean == false ? callback(false, errorStatus, errorCode) :
        
        databaseManager.deleteQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.events,
          'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': eventID } } }

        }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
        {
          boolean ? callback(true) : callback(false, errorStatus, errorCode);
        });
      });
    });
  });
}

/****************************************************************************************************/
