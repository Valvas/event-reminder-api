'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var friendsCheck              = require(`${__root}/functions/friends/check`);
var accountsCheck             = require(`${__root}/functions/accounts/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.updateStatus = (ownerEmail, friendEmail, status, databaseConnector, callback) =>
{
  if(ownerEmail == undefined || friendEmail == undefined || status == undefined || databaseConnector == undefined)
  {
    callback(false, 406, constants.MISSING_DATA_IN_QUERY);
  }

  else if(status != params.friendship.WAITING && status != params.friendship.REJECTED && status != params.friendship.ACCEPTED)
  {
    callback(false, 406, constants.FRIENDSHIP_STATUS_NOT_AUTHORIZED);
  }

  else
  {
    accountsCheck.checkIfAccountExists(ownerEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :
  
      accountsCheck.checkIfAccountExists(friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
      {
        boolean == false ? callback(false, errorStatus, errorCode) :
  
        friendsCheck.checkIfFriendDoesNotExist(ownerEmail, friendEmail, databaseConnector, (boolean, errorStatus, errorCode) =>
        {
          if(boolean) callback(false, 404, constants.FRIENDSHIP_NOT_FOUND);
  
          else if(errorStatus == 500) callback(false, errorStatus, errorCode);
  
          else
          {
            databaseManager.updateQuery(
            {
              'databaseName': params.database.name,
              'tableName': params.database.tables.friends,
  
              'args':
              {
                'status': status
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
            }, databaseConnector, (boolean, errorStatus, errorCode) =>
            {
              boolean ? callback(true) : callback(false, errorStatus, errorCode);
            });
          }
        });
      })
    });
  }
}

/****************************************************************************************************/