'use strict';

var express           = require(`express`);
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var accountsLogon     = require(`${__root}/functions/accounts/logon`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.put('/create-account', (req, res) =>
{
  accountsLogon.createAccount(req.body.account, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ? callback({ result: true }) : callback({ result: false });
  });
});

/****************************************************************************************************/

module.exports = router;