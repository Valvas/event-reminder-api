'use strict';

var express           = require(`express`);
var jwt               = require('jsonwebtoken');
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var accountsLogon     = require(`${__root}/functions/accounts/logon`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.post('/create-account', (req, res) =>
{
  accountsLogon.createAccount(req.body.account, req.app.get('tokenSecret'), req.app.get('databaseConnector'), (tokenOrFalse, errorStatus, errorCode) =>
  {
    tokenOrFalse == false ? res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) : res.status(201).send({ result: true, token: tokenOrFalse }) ;
  });
});

/****************************************************************************************************/

router.get('/check-token-is-valid', (req, res) =>
{
  jwt.verify(req.get('Authorization'), req.app.get('tokenSecret'), (err, decoded) =>
  {
    err ? 
    res.status(401).send({ result: false, message: `${err.message.charAt(0).toUpperCase()}${err.message.slice(1)}` }) :
    res.status(200).send({ result: true });
  });
});

/****************************************************************************************************/

module.exports = router;