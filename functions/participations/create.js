'use strict';

var params            = require(`${__root}/json/params`);
var constants         = require(`${__root}/functions/constants`);
var databaseManager   = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createParticipation = (eventID, accountEmail, databaseConnector, callback) =>
{
  databaseManager.insertQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.participations,

    'uuid': false,

    'args':
    {
      'event_id': eventID,
      'account_email': accountEmail,
      'status': 0
    }
  }, databaseConnector, (boolean, idOrErrorMessage) =>
  {
    boolean ? callback(true) : callback(false, 500, constants.DATABASE_QUERY_ERROR);
  });
}

/****************************************************************************************************/