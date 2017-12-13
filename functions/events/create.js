'use strict';

var params                    = require(`${__root}/json/params`);
var format                    = require(`${__root}/functions/format`);
var constants                 = require(`${__root}/functions/constants`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var participationsCreate      = require(`${__root}/functions/participations/create`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createNewEvent = (obj, databaseConnector, callback) =>
{
  format.checkEventDataAndFormat(obj, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    accountsCheck.checkIfAccountExists(obj.accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.insertQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.events,

        'uuid': false,

        'args':
        {
          "account_email": obj.accountEmail,
          "date": obj.date,
          "is_ponctual": obj.isPonctual ? 1 : 0,
          "cycle_years": obj.timeCycle.years,
          "cycle_months": obj.timeCycle.months,
          "cycle_days": obj.timeCycle.days,
          "cycle_hours": obj.timeCycle.hours,
          "name": obj.name,
          "description": obj.description
        }
      }, databaseConnector, (boolean, idOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          participationsCreate.createParticipation(idOrErrorMessage, obj.accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
          {
            boolean ? callback(true) : callback(false, errorStatus, errorCode);
          });
        }
      });
    });
  });
}

/****************************************************************************************************/