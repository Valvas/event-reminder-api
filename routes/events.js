'use strict';

var express           = require(`express`);
var errors            = require(`${__root}/json/errors`);
var params            = require(`${__root}/json/params`);
var eventsGet         = require(`${__root}/functions/events/get`);
var database          = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.put('/get-my-events', (req, res) =>
{
  eventsGet.getEvents(req.body.email, req.app.get('databaseConnector'), (eventsObjectOrFalse, errorStatus, errorCode) =>
  {
    eventsObjectOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, events: eventsObjectOrFalse });
  });
});

/****************************************************************************************************/

module.exports = router;