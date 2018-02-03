'use strict';

var express                 = require(`express`);
var errors                  = require(`${__root}/json/errors`);
var params                  = require(`${__root}/json/params`);
var friendsGet              = require(`${__root}/functions/friends/get`);
var friendsCreate           = require(`${__root}/functions/friends/create`);
var friendsDelete           = require(`${__root}/functions/friends/delete`);
var friendsUpdate           = require(`${__root}/functions/friends/update`);
var database                = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.get('/get-my-friends', (req, res) =>
{
  friendsGet.getMyFriends(req.token.email, req.app.get('databaseConnector'), (friendsOrFalse, errorStatus, errorCode) =>
  {
    typeof(friendsOrFalse) == 'boolean' && friendsOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, friends: friendsOrFalse });
  });
});

/****************************************************************************************************/

router.get('/get-my-invitation-list', (req, res) =>
{
  friendsGet.getMyInvitationList(req.token.email, req.app.get('databaseConnector'), (invitationsOrFalse, errorStatus, errorCode) =>
  {
    typeof(invitationsOrFalse) == 'boolean' && invitationsOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, invitations: invitationsOrFalse });
  });
});

/****************************************************************************************************/

router.post('/add-friend', (req, res) =>
{
  friendsCreate.createNewFriend(req.token.email, req.body.friendEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.post('/delete-friend', (req, res) =>
{
  friendsDelete.deleteFriend(req.token.email, req.body.friendEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.post('/update-friend-status', (req, res) =>
{
  friendsUpdate.updateStatus(req.token.email, req.body.friendEmail, req.body.status, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.post('/accept-invitation', (req, res) =>
{
  friendsUpdate.updateStatus(req.body.friendEmail, req.token.email, params.friendship.ACCEPTED, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.post('/reject-invitation', (req, res) =>
{
  friendsUpdate.updateStatus(req.body.friendEmail, req.token.email, params.friendship.REJECTED, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

module.exports = router;