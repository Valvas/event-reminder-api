'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var friendsCheck              = require(`${__root}/functions/friends/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createNewFriend = (ownerEmail, friendEmail, databaseConnector, callback) =>
{
  accountsCheck.checkIfAccountExists(ownerEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
  {
    boolean == false ? callback(false, errorStatus, errorCode) :

    accountsCheck.checkIfAccountExists(friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      friendsCheck.checkIfFriendDoesNotExist(ownerEmail, friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        if(boolean == false && errorStatus == 500) callback(false, errorStatus, errorCode);

        else if(boolean == false && errorStatus == 406)
        {
          friendsCheck.checkExistingFriendIsInStatusRejected(ownerEmail, friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
          {
            boolean == false ? callback(false, errorStatus, errorCode) :

            databaseManager.updateQuery(
            {
              'databaseName': params.database.name,
              'tableName': params.database.tables.friends,

              'args':
              {
                'status': params.friendship.WAITING
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
            }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
            {
              boolean ? callback(true) : callback(false, 500, constants.DATABASE_QUERY_ERROR);
            });
          });
        }

        else
        {
          databaseManager.insertQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.friends,

            'uuid': false,

            'args':
            {
              'friend_email': friendEmail,
              'owner_email': ownerEmail,
              'status': params.friendship.WAITING
            }
          }, databaseConnector, (boolean, insertedIdOrErrorMessage) =>
          {
            boolean ? callback(true) : callback(false, 500, constants.DATABASE_QUERY_ERROR);
          });
        }
      });
    });
  });
}

/****************************************************************************************************/