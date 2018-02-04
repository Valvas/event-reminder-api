'use strict';

var express                 = require(`express`);
var errors                  = require(`${__root}/json/errors`);
var params                  = require(`${__root}/json/params`);
var constants               = require(`${__root}/functions/constants`);
var eventsSet               = require(`${__root}/functions/events/set`);
var eventsGet               = require(`${__root}/functions/events/get`);
var eventsCreate            = require(`${__root}/functions/events/create`);
var eventsDelete            = require(`${__root}/functions/events/delete`);
var participationsDelete    = require(`${__root}/functions/participations/delete`);
var database                = require(`${__root}/functions/database/${params.database.dbms}`);

var router = express.Router();

/****************************************************************************************************/

router.get('/get-my-events', (req, res) =>
{
  eventsGet.getEvents(req.token.email, req.app.get('databaseConnector'), (eventsObjectOrFalse, errorStatus, errorCode) =>
  {
    typeof(eventsObjectOrFalse) == 'boolean' && eventsObjectOrFalse == false ?
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` }) :
    res.status(200).send({ result: true, events: eventsObjectOrFalse });
  });
});

/****************************************************************************************************/

router.post('/create-new-event', (req, res) =>
{
  eventsCreate.createNewEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), req.app.get('notificationSender'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(201).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.put('/update-event', (req, res) =>
{
  req.body.event == undefined ?

  res.status(406).send({ result: false, message: `Error [406] - ${errors[10005]} !` }) : 

  eventsSet.updateEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Erreur [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.post('/delete-event', (req, res) =>
{
  req.body.event == undefined ?

  res.status(406).send({ result: false, message: `Error [406] - ${errors[10005]} !` }) : 

  eventsDelete.deleteEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), req.app.get('notificationSender'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

router.post('/cancel-event', (req, res) =>
{
  req.body.event == undefined ?

  res.status(406).send({ result: false, message: `Error [406] - ${errors[10005]} !` }) :

  eventsDelete.cancelEvent(req.body.event, req.token.email, req.app.get('databaseConnector'), req.app.get('notificationSender'), (boolean, errorStatus, errorCode) =>
  {
    boolean ?
    res.status(200).send({ result: true }) :
    res.status(errorStatus).send({ result: false, message: `Error [${errorStatus}] - ${errors[errorCode]} !` });
  });
});

/****************************************************************************************************/

module.exports = router;