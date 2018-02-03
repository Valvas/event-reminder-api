'use strict';

var express           = require(`express`);
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var notificationsAdd  = require(`${__root}/functions/notifications/add`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.post('/add-notification-token', (req, res) =>
{
  notificationsAdd.addNotificationToken(req.token.email, req.body.token, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

module.exports = router;