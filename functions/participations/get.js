'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var friendsGet                = require(`${__root}/functions/friends/get`);
var eventsCheck               = require(`${__root}/functions/events/check`);
var accountsGet               = require(`${__root}/functions/accounts/get`);
var participationsCheck       = require(`${__root}/functions/participations/check`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.getParticipationStatusForOneEvent = (eventID, accountEmail, databaseConnector, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    eventsCheck.checkIfEventExists(eventID, databaseConnector, (boolean, errorStatus, errorCode) =>
    {
      boolean == false ? callback(false, errorStatus, errorCode) :

      databaseManager.selectQuery(
      {
        'databaseName': params.database.name,
        'tableName': params.database.tables.participations,
        'args': { '0': 'status' },
        'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventID }, '1': { 'key': 'account_email', 'value': accountEmail } } } }
  
      }, databaseConnector, (boolean, participationOrErrorMessage) =>
      {
        if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

        else
        {
          participationOrErrorMessage.length == 0 ? 
          callback(false, 406, constants.NOT_A_PARTICIPANT_OF_CURRENT_EVENT) :
          callback(participationOrErrorMessage[0].status);
        }
      });
    });
  });
}

/****************************************************************************************************/

module.exports.getParticipationStatusForAllEvents = (accountEmail, databaseConnector, callback) =>
{
  accountsGet.getAccountUsingEmail(accountEmail, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    databaseManager.selectQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.participations,
      'args': { '0': '*' },
      'where': { '0': { 'operator': '=', '0': { 'key': 'account_email', 'value': accountEmail } } }

    }, databaseConnector, (boolean, statusOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

      else
      {
        if(statusOrErrorMessage.length == 0) callback({});

        else
        {
          var x  = 0;
          var obj = {};
          
          var statusLoop = () =>
          {
            obj[x] = {};
            obj[x] = statusOrErrorMessage[x];

            statusOrErrorMessage[x += 1] == undefined ? callback(obj) : statusLoop();
          }

          statusLoop();
        }     
      }
    });
  });
}

/****************************************************************************************************/

module.exports.getFriendsToInvite = (eventID, emailAddress, databaseConnector, callback) =>
{
  eventID             == undefined ||
  emailAddress        == undefined ||
  databaseConnector   == undefined ?

  callback(false, 406, constants.MISSING_DATA_IN_QUERY) :
  
  accountsGet.getAccountUsingEmail(emailAddress, databaseConnector, (accountOrFalse, errorStatus, errorCode) =>
  {
    accountOrFalse == false ? callback(false, errorStatus, errorCode) :

    friendsGet.getMyFriends(emailAddress, databaseConnector, (friendsArray, errorStatus, errorCode) =>
    {
      if(typeof(friendsArray) == 'boolean' && friendsArray == false) callback(false, errorStatus, errorCode);

      else
      {
        var x = 0;
        var array = [];
        
        var loop = () =>
        {
          databaseManager.selectQuery(
          {
            'databaseName': params.database.name,
            'tableName': params.database.tables.participations,
            'args': { '0': 'status' },
            'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': eventID }, '1': { 'key': 'account_email', 'value': friendsArray[x]['friendData']['email'] } } } }
          
          }, databaseConnector, (boolean, participantOrErrorMessage) =>
          {
            if(boolean == false) callback(false, 500, constants.DATABASE_QUERY_ERROR);

            else
            {
              if(participantOrErrorMessage.length == 0 || participantOrErrorMessage[0].status == params.participationStatus.REJECTED)
              {
                array.push(friendsArray[x]['friendData']);
              }

              friendsArray[x += 1] == undefined ? callback(array) : loop();
            }
          });
        }

        friendsArray[x] == undefined ? callback([]) : loop();
      }
    });
  });
}

/****************************************************************************************************/