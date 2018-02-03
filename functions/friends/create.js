'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var friendsCheck              = require(`${__root}/functions/friends/check`);
var notificationsSend         = require(`${__root}/functions/notifications/send`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.createNewFriend = (ownerEmail, friendEmail, databaseConnector, sender, callback) =>
{
  accountsGet.getAccountUsingEmail(ownerEmail, databaseConnector, (ownerAccountOrFalse, errorStatus, errorCode) =>
  {
    ownerAccountOrFalse == false ? callback(false, errorStatus, errorCode) :

    accountsGet.getAccountUsingEmail(friendEmail, databaseConnector, (friendAccountOrFalse, errorStatus, errorCode) =>
    {
      if(friendAccountOrFalse == false) callback(false, errorStatus, errorCode);

      else
      {
        friendEmail == ownerEmail ? callback(false, 406, constants.CANNOT_ADD_YOURSELF_AS_FRIEND) :

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
                'args': { 'status': params.friendship.WAITING },
                'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'friend_email', 'value': friendEmail }, '1': { 'key': 'owner_email', 'value': ownerEmail } } } }
              
              }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
              {
                if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

                else
                {
                  notificationsSend.informUserInvitedToBeFriend(sender, ownerAccountOrFalse, friendEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
                  {
                    if(boolean == false) console.log(`Error [${errorStatus}] - ${errorMessage} !`);

                    callback(true);
                  });
                }
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
              'args': { 'friend_email': friendEmail, 'owner_email': ownerEmail, 'status': params.friendship.WAITING }
              
            }, databaseConnector, (boolean, insertedIdOrErrorMessage) =>
            {
              if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

              else
              {
                notificationsSend.informUserInvitedToBeFriend(sender, ownerAccountOrFalse, friendEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
                {
                  if(boolean == false) console.log(`Error [${errorStatus}] - ${errorMessage} !`);
                    
                  callback(true);
                });
              }
            });
          }
        });
      }
    });
  });
}

/****************************************************************************************************/