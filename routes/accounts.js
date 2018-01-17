'use strict';

var express           = require(`express`);
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/



/****************************************************************************************************/

module.exports = router;