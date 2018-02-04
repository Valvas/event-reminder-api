'use strict';

var gcm                       = require('node-gcm');
var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var notificationsGet          = require(`${__root}/functions/notifications/get`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.sendEventReminder = (sender, event, accountEmail, databaseConnector, callback) =>
{
  sendNotifications(sender, `Un événement va commencer`, `L'événement "${event.name}" débute dans 1 heure`, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

module.exports.sendEventIsStarting = (sender, event, accountEmail, databaseConnector, callback) =>
{
  sendNotifications(sender, `Un événement commence`, `L'événement "${event.name}" débute`, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

module.exports.informUserInvitedToBeFriend = (sender, owner, friendEmail, databaseConnector, callback) =>
{
  sendNotifications(sender, `Vous avez une demande d'ami`, `${owner.firstname} ${owner.lastname} vous a invité à devenir son ami sur Event Reminder`, friendEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

module.exports.friendHasAcceptedInvitation = (sender, accountEmail, friend, databaseConnector, callback) =>
{
  sendNotifications(sender, `Demande d'ami acceptée`, `${friend.firstname} ${friend.lastname} a accepté votre demande d'invitation`, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

module.exports.friendHasRejectedInvitation = (sender, accountEmail, friend, databaseConnector, callback) =>
{
  sendNotifications(sender, `Demande d'ami refusée`, `${friend.firstname} ${friend.lastname} a refusé votre demande d'invitation`, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

module.exports.invitedToParticipateToEvent = (sender, event, accountEmail, databaseConnector, callback) =>
{
  sendNotifications(sender, `Invitation à un événement`, `Vous avez été invité à participer à l'événement "${event.name}"`, accountEmail, databaseConnector, (boolean, errorStatus, errorMessage) =>
  {
    boolean == false ? callback(false, errorStatus, errorMessage) : callback(true);
  });
}

/****************************************************************************************************/

function sendNotifications(sender, title, messageContent, accountEmail, databaseConnector, callback)
{
  notificationsGet.getNotificationTokensForAccount(accountEmail, databaseConnector, (tokensOrFalse, errorStatus, errorCode) =>
  {
    if(tokensOrFalse == false) callback(false, errorStatus, errorCode);

    else
    {
      var message = new gcm.Message(
      {
        notification: 
        {
          title: title,
          body: messageContent
        },
      });
      
      console.log(`[NOTIFICATION] - Sending notifications to ${tokensOrFalse.length} devices of "${accountEmail}" with content "${messageContent}"...`);

      sender.send(message, { registrationTokens: tokensOrFalse }, (err, response) =>
      {
        console.log(response);
        console.log(tokensOrFalse);
        err ? callback(false, 500, err.message) : callback(true);
      });
    }
  });
}

/****************************************************************************************************/