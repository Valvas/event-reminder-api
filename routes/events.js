'use strict';

var express                 = require(`express`);
var errors                  = require(`${__root}/json/errors`);
var params                  = require(`${__root}/json/params`);
var eventsGet               = require(`${__root}/functions/events/get`);
var eventsParticipants      = require(`${__root}/functions/events/participants`);
var database                = require(`${__root}/functions/database/${params.database.dbms}`);

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

router.put('/get-participants-to-event', (req, res) =>
{
  eventsParticipants.getParticipantsToEvent(req.body.event, req.app.get('databaseConnector'), (participants, errorStatus, errorCode) =>
  {
    participants == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, participants: participants });
  });
});

/****************************************************************************************************/

module.exports = router;