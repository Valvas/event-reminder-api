'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

var format = module.exports = {};

/****************************************************************************************************/

format.checkEmailFormat = (str, callback) =>
{
  callback(new RegExp("^[a-zA-Z][\\w\\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\\w\\.-]*[a-zA-Z0-9]\\.[a-zA-Z][a-zA-Z\\.]*[a-zA-Z]$").test(str));
}

/****************************************************************************************************/

format.checkStrFormat = (str, rules, callback) =>
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

format.checkEventDataAndFormat = (obj, accountEmail, callback) =>
{
  obj                     == undefined ||
  obj.name                == undefined ||
  obj.description         == undefined ||
  accountEmail            == undefined ||
  obj.date                == undefined ||
  obj.isPonctual          == undefined ||
  obj.timeCycle           == undefined ||
  obj.timeCycle.years     == undefined ||
  obj.timeCycle.months    == undefined ||
  obj.timeCycle.days      == undefined ||
  obj.timeCycle.hours     == undefined ||
  obj.timeCycle.minutes   == undefined ?
  
  callback(false, 406, constants.MISSING_DATA_IN_QUERY) :

  format.checkStrFormat(obj.name, params.format.event.name, (boolean) =>
  {console.log(boolean);
    boolean == false ? callback(false, 406, constants.BAD_FORMAT) :

    format.checkStrFormat(obj.description, params.format.event.description, (boolean) =>
    {console.log(boolean);
      if(boolean == false) callback(false, 406, constants.BAD_FORMAT);

      else
      {
        if(obj.date * 1000 < Date.now() + 900000){ console.log(false);callback(false, 406, constants.BAD_FORMAT); }

        else if(typeof(obj.isPonctual) != 'boolean'){ console.log(false);callback(false, 406, constants.BAD_FORMAT); }
                      
        else
        {
          var time =  obj.timeCycle.years   * 31536000000 +
                      obj.timeCycle.months  * 2592000000 +
                      obj.timeCycle.days    * 86400000 +
                      obj.timeCycle.hours   * 3600000 +
                      obj.timeCycle.minutes * 60000;
          
          if(time < params.rules.event.timeCycle.min){ console.log(false);callback(false, 406, constants.BAD_FORMAT); }

          else if(time > params.rules.event.timeCycle.max){ console.log(false);callback(false, 406, constants.BAD_FORMAT); }

          else{ callback(true); }
        }
      }
    });
  });
}

/****************************************************************************************************/
