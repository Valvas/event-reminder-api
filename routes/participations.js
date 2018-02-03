'use strict';

var express                 = require(`express`);
var errors                  = require(`${__root}/json/errors`);
var params                  = require(`${__root}/json/params`);
var constants               = require(`${__root}/functions/constants`);
var eventsGet               = require(`${__root}/functions/events/get`);
var eventsSet               = require(`${__root}/functions/events/set`);
var participationsGet       = require(`${__root}/functions/participations/get`);
var participationsCreate    = require(`${__root}/functions/participations/create`);
var participationsDelete    = require(`${__root}/functions/participations/delete`);
var database                = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.put('/update-participation-status', (req, res) =>
{
  eventsSet.setParticipationStatusToEvent(req.body.update, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Erreur [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.post('/add-participant-to-event', (req, res) =>
{
  participationsCreate.createParticipation(req.body.event, req.body.participantEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(201).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.post('/remove-participant-from-event', (req, res) =>
{
  req.token.email == undefined || req.body.event == undefined || req.body.participantEmail == undefined ? 

  res.status(406).send({ result: false, message: `Error [406] - ${errors[10005]} !` }) :

  participationsDelete.removeParticipantFromEvent(req.body.event, req.token.email, req.body.participantEmail, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.post('/remove-participants-from-event', (req, res) =>
{
  req.body.event == undefined ? 

  res.status(406).send({ result: false, message: `Error [406] - ${errors[10005]} !` }) :

  participationsDelete.removeParticipantsFromEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.put('/get-participants-to-event', (req, res) =>
{
  eventsGet.getParticipantsToEvent(req.body.event, req.app.get('databaseConnector'), (participants, errorStatus, errorCode) =>
  {
    participants == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, participants: participants });
  });
});

/****************************************************************************************************/

router.put('/get-my-participation-status-for-one-event', (req, res) =>
{
  req.token.email == undefined || req.body.event == undefined ? 
  
  res.status(406).send({ result: false, message: `Error [406] - ${errors[constants.MISSING_DATA_IN_QUERY]} !` }) :

  participationsGet.getParticipationStatusForOneEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), (statusOrFalse, errorStatus, errorCode) =>
  {
    typeof(statusOrFalse) == 'boolean' && statusOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, participation: statusOrFalse });
  });
});

/****************************************************************************************************/

router.get('/get-my-participation-status-for-all-events', (req, res) =>
{
  req.token.email == undefined ?

  res.status(406).send({ result: false, message: `Error [406] - ${errors[constants.MISSING_DATA_IN_QUERY]} !` }) :

  participationsGet.getParticipationStatusForAllEvents(req.token.email, req.app.get('databaseConnector'), (statusOrFalse, errorStatus, errorCode) =>
  {
    statusOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, participations: statusOrFalse });
  });
});

/****************************************************************************************************/

module.exports = router;