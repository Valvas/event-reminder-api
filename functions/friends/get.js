'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getMyFriends = (emailAddress, databaseConnector, callback) =>
{
  emailAddress == undefined || databaseConnector == undefined ?

  callback(false, 406, constants.MISSING_DATA_IN_QUERY) :

  accountsGet.getAccountUsingEmail(emailAddress, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    databaseManager.selectQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.friends,
      'args': { '0': '*' },
      'where': { '0': { 'operator': 'OR', '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'owner_email', 'value': emailAddress }, '1': { 'key': 'status', 'value': params.friendship.ACCEPTED } } }, '1': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'friend_email', 'value': emailAddress }, '1': { 'key': 'status', 'value': params.friendship.ACCEPTED } } } } }

    }, databaseConnector, (boolean, friendsOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        var array = [];
        var x = 0;

        var loop = () =>
        {
          array.push(friendsOrErrorMessage[x]);

          if(friendsOrErrorMessage[x].owner_email == emailAddress)
          {
            accountsGet.getAccountUsingEmail(friendsOrErrorMessage[x].friend_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
            {
              array[x]['friendData'] = {};
              array[x]['friendData'] = accountOrFalse;

              friendsOrErrorMessage[x += 1] == undefined ? callback(array) : loop();
            });
          }

          else
          {
            accountsGet.getAccountUsingEmail(friendsOrErrorMessage[x].owner_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
            {
              array[x]['friendData'] = {};
              array[x]['friendData'] = accountOrFalse;

              friendsOrErrorMessage[x += 1] == undefined ? callback(array) : loop();
            });
          }
        }

        friendsOrErrorMessage.length == 0 ? callback(array) : loop();
      }
    });
  });
}

/****************************************************************************************************/

module.exports.getMyInvitationList = (emailAddress, databaseConnector, callback) =>
{
  emailAddress == undefined || databaseConnector == undefined ?

  callback(false, 406, constants.MISSING_DATA_IN_QUERY) :

  accountsGet.getAccountUsingEmail(emailAddress, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    databaseManager.selectQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.friends,
      'args': { '0': '*' },
      'where':
      {
        '0':
        {
          'operator': 'OR',
          '0':
          {
            'operator': 'AND',
            '0':
            {
              'operator': '=',
              '0':
              {
                'key': 'owner_email',
                'value': emailAddress
              },
              '1':
              {
                'key': 'status',
                'value': params.friendship.WAITING
              }
            }
          },
          '1':
          {
            'operator': 'AND',
            '0':
            {
              'operator': '=',
              '0':
              {
                'key': 'owner_email',
                'value': emailAddress
              },
              '1':
              {
                'key': 'status',
                'value': params.friendship.REJECTED
              }
            }
          },
          '2':
          {
            'operator': 'AND',
            '0':
            {
              'operator': '=',
              '0':
              {
                'key': 'friend_email',
                'value': emailAddress
              },
              '1':
              {
                'key': 'status',
                'value': params.friendship.WAITING
              }
            }
          }
        }
      }
    }, databaseConnector, (boolean, friendshipsOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        var data = [];

        if(friendshipsOrErrorMessage.length == 0) callback(data);

        else
        {
          var x = 0;

          var loop = () =>
          {
            var friendship = {};

            friendship['id'] = friendshipsOrErrorMessage[x].id;
            friendship['status'] = friendshipsOrErrorMessage[x].status;

            if(friendshipsOrErrorMessage[x].owner_email == emailAddress)
            {
              friendship['owner'] = accountOrFalse;

              accountsGet.getAccountUsingEmail(friendshipsOrErrorMessage[x].friend_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
              {
                if(accountOrFalse == false) callback(false, errorStatus, errorCode);

                else
                {
                  friendship['friend'] = accountOrFalse;

                  data.push(friendship);

                  friendshipsOrErrorMessage[x += 1] == undefined ? callback(data) : loop();
                }
              });
            }

            else if(friendshipsOrErrorMessage[x].friend_email == emailAddress)
            {
              friendship['friend'] = accountOrFalse;

              accountsGet.getAccountUsingEmail(friendshipsOrErrorMessage[x].owner_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
              {
                if(accountOrFalse == false) callback(false, errorStatus, errorCode);

                else
                {
                  friendship['owner'] = accountOrFalse;

                  data.push(friendship);

                  friendshipsOrErrorMessage[x += 1] == undefined ? callback(data) : loop();
                }
              });
            }
          }

          loop();
        }
      }
    });
  });
}

/****************************************************************************************************/