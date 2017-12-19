'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.checkIfFriendDoesNotExist = (ownerEmail, friendEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.friends,

    'args':
    {
      '0': 'id'
    },

    'where':
    {
      'AND':
      {
        '=':
        {
          '0':
          {
            'key': 'friend_email',
            'value': friendEmail
          },
          '1':
          {
            'key': 'owner_email',
            'value': ownerEmail
          }
        }
      }
    }
  }, databaseConnector, (boolean, friendOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else
    {
      friendOrErrorMessage.length == 0 ? callback(true) : callback(false, 406, constants.FRIEND_ALREADY_EXISTS);
    }
  });
}

/****************************************************************************************************/

module.exports.checkExistingFriendIsInStatusRejected = (ownerEmail, friendEmail, databaseConnector, callback) =>
{
  databaseManager.selectQuery(
  {
    'databaseName': params.database.name,
    'tableName': params.database.tables.friends,
  
    'args':
    {
      '0': 'status'
    },
  
    'where':
    {
      'AND':
      {
        '=':
        {
          '0':
          {
            'key': 'friend_email',
            'value': friendEmail
          },
          '1':
          {
            'key': 'owner_email',
            'value': ownerEmail
          }
        }
      }
    }
  }, databaseConnector, (boolean, friendOrErrorMessage) =>
  {
    if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

    else if(friendOrErrorMessage.length == 0) callback(false, 404, constants.FRIENDSHIP_NOT_FOUND);

    else
    {
      friendOrErrorMessage[0].status == 1 ? callback(true) : callback(false, 406, constants.FRIENDSHIP_NOT_IN_REJECTED_STATUS);
    }
  });
}

/****************************************************************************************************/