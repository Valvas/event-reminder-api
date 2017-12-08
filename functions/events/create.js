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
  checkDataAreNotMissingAndFormat(obj, (boolean, errorStatus, errorCode) =>
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

function checkDataAreNotMissingAndFormat(obj, callback)
{
  if(obj == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
  
  else
  {
    if(obj.name == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

    else
    {
      format.checkStrFormat(obj.name, params.format.event.name, (boolean) =>
      {
        if(boolean == false) callback(false, 406, constants.BAD_FORMAT);

        else
        {
          if(obj.description == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

          else
          {
            format.checkStrFormat(obj.description, params.format.event.description, (boolean) =>
            {
              if(boolean == false) callback(false, 406, constants.BAD_FORMAT);

              else
              {
                if(obj.accountEmail == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

                else
                {
                  if(obj.date == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

                  else if(typeof(obj.date) != 'number') callback(false, 406, constants.BAD_FORMAT);

                  else
                  {
                    if(obj.date < Date.now() + 3600000) callback(false, 406, constants.BAD_FORMAT);

                    else
                    {
                      if(obj.isPonctual == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
                      
                      else if(typeof(obj.isPonctual) != 'boolean') callback(false, 406, constants.BAD_FORMAT);
                      
                      else
                      {
                        if(obj.timeCycle == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

                        else if(obj.timeCycle.years == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
                        else if(obj.timeCycle.months == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
                        else if(obj.timeCycle.days == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
                        else if(obj.timeCycle.hours == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

                        else if(obj.timeCycle.years < params.rules.event.timeCycle.years.min) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.years > params.rules.event.timeCycle.years.max) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.months < params.rules.event.timeCycle.months.min) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.months > params.rules.event.timeCycle.months.max) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.days < params.rules.event.timeCycle.days.min) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.days > params.rules.event.timeCycle.days.max) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.hours < params.rules.event.timeCycle.hours.min) callback(false, 406, constants.BAD_FORMAT);
                        else if(obj.timeCycle.hours > params.rules.event.timeCycle.hours.max) callback(false, 406, constants.BAD_FORMAT);
                        else
                        { 
                          callback(true); 
                        }
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  }
}

/****************************************************************************************************/