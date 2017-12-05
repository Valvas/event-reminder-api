'use strict';

var express           = require(`express`);
var params            = require(`${__root}/json/params`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.put('/get-my-events', (req, res) =>
{

});

/****************************************************************************************************/

module.exports = router;