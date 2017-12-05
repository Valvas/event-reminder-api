'use strict';

var express           = require(`express`);
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var accountsLogon     = require(`${__root}/functions/accounts/logon`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.post('/create-account', (req, res) =>
{
  accountsLogon.createAccount(req.body.account, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ? res.status(201).send({ result: true }) : res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

module.exports = router;