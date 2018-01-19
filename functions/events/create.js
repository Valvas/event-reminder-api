'use strict';

var params                    = require(`${__root}/json/params`);
var format                    = require(`${__root}/functions/format`);
var constants                 = require(`${__root}/functions/constants`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var participationsCreate      = require(`${__root}/functions/participations/create`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createNewEvent = (obj, accountEmail, databaseConnector, callback) =>
{
  format.checkEventDataAndFormat(obj, accountEmail, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
    {
      if(accountOrFalse == false) callback(false, errorStatus, errorCode);

      else
      {
        var date = new Date(obj.date * 1000);

        date.setSeconds(0);
        date.setMilliseconds(0);

        databaseManager.insertQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.events,
          'uuid': false,
          'args':
          {
            "account_email": accountEmail,
            "date": date.getTime(),
            "is_ponctual": obj.isPonctual ? 1 : 0,
            "cycle_years": obj.timeCycle.years,
            "cycle_months": obj.timeCycle.months,
            "cycle_days": obj.timeCycle.days,
            "cycle_hours": obj.timeCycle.hours,
            "cycle_minutes": obj.timeCycle.minutes,
            "name": obj.name,
            "description": obj.description
          }
        }, databaseConnector, (boolean, idOrErrorMessage) =>
        {
          if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);
    
          else
          {
            participationsCreate.createParticipation(idOrErrorMessage, accountEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
            {
              boolean ? callback(true) : callback(false, errorStatus, errorCode);
            });
          }
        });
      }
    });
  });
}

/****************************************************************************************************/