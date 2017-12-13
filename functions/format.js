'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.checkEmailFormat = (str, callback) =>
{
  callback(new RegExp("^[a-zA-Z][\\w\\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\\w\\.-]*[a-zA-Z0-9]\\.[a-zA-Z][a-zA-Z\\.]*[a-zA-Z]$").test(str));
}

/****************************************************************************************************/

module.exports.checkStrFormat = (str, rules, callback) =>
{
  var check = true;

  if(rules['min-length'] != false){ if(str.length < rules['min-length']){ check = false; } }
  if(rules['max-length'] != false){ if(str.length > rules['max-length']){ check = false; } }

  if(rules['required-digit'] == true){ if(str.match(/\d/) == null){ check = false; } }
  if(rules['authorized-digit'] == false){ if(str.match(/\d/) != null){ check = false; } }

  if(rules['required-spaces'] == true){ if(str.match(/\s/) == null){ check = false; } }
  if(rules['authorized-spaces'] == false){ if(str.match(/\s/) != null){ check = false; } }

  if(rules['required-lowercase'] == true){ if(str.toUpperCase() == str){ check = false; } }
  if(rules['authorized-lowercase'] == false){ if(str.toUpperCase() != str){ check = false; } }

  if(rules['required-uppercase'] == true){ if(str.toLowerCase() == str){ check = false; } }
  if(rules['authorized-uppercase'] == false){ if(str.toLowerCase() != str){ check = false; } }

  if(rules['required-special'] == true){ if(str.match(/[^\s\w]/) == null){ check = false; } }
  if(rules['authorized-special'] == false){ if(str.match(/[^\s\w]/) != null){ check = false; } }

  callback(check);
}

/****************************************************************************************************/

module.exports.checkEventDataAndFormat = (obj, callback) =>
{
  if(obj == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);
  
  else
  {
    if(obj.name == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

    else
    {
      this.checkStrFormat(obj.name, params.format.event.name, (boolean) =>
      {
        if(boolean == false) callback(false, 406, constants.BAD_FORMAT);

        else
        {
          if(obj.description == undefined) callback(false, 406, constants.MISSING_DATA_IN_QUERY);

          else
          {
            this.checkStrFormat(obj.description, params.format.event.description, (boolean) =>
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
