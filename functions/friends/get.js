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
      'args': { '0': 'friend_email' },
      'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'owner_email', 'value': emailAddress }, '1': { 'key': 'status', 'value': params.friendship.ACCEPTED } } } }

    }, databaseConnector, (boolean, friendsOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        var obj = {};
        var x = 0, y = 0;

        var loop = () =>
        {
          accountsGet.getAccountUsingEmail(friendsOrErrorMessage[x].friend_email, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
          {
            if(accountOrFalse == false)
            {
              friendsOrErrorMessage[x += 1] == undefined ? callback(obj) : loop();
            }

            else
            {
              obj[y] = {};
              obj[y] = accountOrFalse;

              y += 1;

              friendsOrErrorMessage[x += 1] == undefined ? callback(obj) : loop();
            }
          });
        }

        friendsOrErrorMessage.length == 0 ? callback({}) : loop();
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
        friendshipsOrErrorMessage.length == 0 ? callback({}) : callback(friendshipsOrErrorMessage);
      }
    });
  });
}

/****************************************************************************************************/