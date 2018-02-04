'use strict';

var express           = require('express');
var jwt               = require('jsonwebtoken');
var params            = require(`${__root}/json/params`);
var errors            = require(`${__root}/json/errors`);
var constants         = require(`${__root}/functions/constants`);

var app = express();

/****************************************************************************************************/

module.exports = (req, res, next) =>
{
  req.get('Authorization') == undefined ?

  res.status(401).send({ result: false, message: `${errors[constants.AUTHENTICATION_TOKEN_REQUIRED].charAt(0).toUpperCase()}${errors[constants.AUTHENTICATION_TOKEN_REQUIRED].slice(1)}` }) :

  jwt.verify(req.get('Authorization'), req.app.get('tokenSecret'), (err, decoded) =>
  {console.log(err);
    if(err) res.status(500).send({ result: false, message: `${err.message.charAt(0).toUpperCase()}${err.message.slice(1)}` });

    else
    {
      req.token = decoded;
      next();
    }
  });
}

/****************************************************************************************************/