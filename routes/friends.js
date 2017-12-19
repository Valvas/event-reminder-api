'use strict';

var express                 = require(`express`);
var errors                  = require(`${__root}/json/errors`);
var params                  = require(`${__root}/json/params`);
var friendsCreate           = require(`${__root}/functions/friends/create`);
var friendsDelete           = require(`${__root}/functions/friends/delete`);
var friendsUpdate           = require(`${__root}/functions/friends/update`);
var database                = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.post('/add-friend', (req, res) =>
{
  friendsCreate.createNewFriend(req.body.ownerEmail, req.body.friendEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.delete('/delete-friend', (req, res) =>
{
  friendsDelete.deleteFriend(req.body.ownerEmail, req.body.friendEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

router.put('/update-friend-status', (req, res) =>
{
  friendsUpdate.updateStatus(req.body.ownerEmail, req.body.friendEmail, req.body.status, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

module.exports = router;