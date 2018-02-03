'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getNotificationTokensForAccount = (accountEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.notifications,
    'args': { '0': 'token' },
    'where': { '0': { 'operator': '=', '0': { 'key': 'email', 'value': accountEmail } } }

  }, databaseConnector, (boolean, tokensOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      var x = 0;
      var tokens = [];

      var loop = () =>
      {
        tokens.push(tokensOrErrorMessage[x]);

        tokensOrErrorMessage[x += 1] == undefined ? callback(tokens) : loop();
      }

      tokensOrErrorMessage.length == 0 ? callback(tokens) : loop();
    }
  });
}

/****************************************************************************************************/