'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var friendsCheck              = require(`${__root}/functions/friends/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.deleteFriend = (ownerEmail, friendEmail, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(ownerEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    accountsCheck.checkIfAccountExists(friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      friendsCheck.checkIfFriendDoesNotExist(ownerEmail, friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        if(boolean == true) callback(true);

        else if(boolean == false && errorStatus == 500) callback(false, errorStatus, errorCode);

        else
        {
          databaseManager.deleteQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.friends,

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
          }, databaseConnector, (boolean, deletedRowsOrErrorMessage) =>
          {
            if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

            else
            {
              deletedRowsOrErrorMessage == 0 ? callback(false, 500, constants.FRIENDSHIP_NOT_DELETED) : callback(true);
            }
          });
        }
      });
    });
  });
}

/****************************************************************************************************/