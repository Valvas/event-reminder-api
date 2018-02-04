'use strict';

var params                    = require(`${__root}/json/params`);
var constants                 = require(`${__root}/functions/constants`);
var notificationsSend         = require(`${__root}/functions/notifications/send`);
var databaseManager           = require(`${__root}/functions/database/${params.database.dbms}`);

/****************************************************************************************************/

module.exports.updateEventDateUsingCycle = (event, databaseConnector, sender, callback) =>
{
  if(event.is_ponctual == true) callback(true);

  else
  {
    var currentDate = new Date(event.date);

    currentDate.setFullYear(currentDate.getFullYear() + parseInt(event.cycle_years));
    currentDate.setMonth(currentDate.getMonth() + parseInt(event.cycle_months));
    currentDate.setDate(currentDate.getDate() + parseInt(event.cycle_days));
    currentDate.setHours(currentDate.getHours() + parseInt(event.cycle_hours));
    currentDate.setMinutes(currentDate.getMinutes() + parseInt(event.cycle_minutes));

    databaseManager.updateQuery(
    {
      'databaseName': params.database.name,
      'tableName': params.database.tables.events,
      'args': { 'date': currentDate.getTime() },
      'where': { '0': { 'operator': '=', '0': { 'key': 'id', 'value': event.id } } } 
    
    }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
    {
      if(boolean == false) callback(false, 500, updatedRowsOrErrorMessage);

      else
      {
        databaseManager.updateQuery(
        {
          'databaseName': params.database.name,
          'tableName': params.database.tables.participations,
          'args': { 'status': params.participationStatus.WAITING },
          'where': { '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': event.id } } } 
          
        }, databaseConnector, (boolean, updatedRowsOrErrorMessage) =>
        {
          if(boolean == false) callback(false, 500, updatedRowsOrErrorMessage);

          else
          {
            databaseManager.selectQuery(
            {
              'databaseName': params.database.name,
              'tableName': params.database.tables.participations,
              'args': { '0': '*' },
              'where': { '0': { 'operator': 'AND', '0': { 'operator': '=', '0': { 'key': 'event_id', 'value': event.id }, '1': { 'key': 'status', 'value': params.participationStatus.WAITING } } } }
                
            }, databaseConnector, (boolean, participantsOrErrorMessage) =>
            {
              if(boolean == false) callback(false, 500, participantsOrErrorMessage);

              else
              {
                var x = 0;
                
                var loop = () =>
                {
                  notificationsSend.invitedToParticipateToEvent(sender, event, participantsOrErrorMessage[x].account_email, databaseConnector, (boolean, errorStatus, errorMessage) =>
                  {
                    if(boolean == false) console.log(`Error [${errorStatus}] - ${errorMessage} !`);

                    participantsOrErrorMessage[x += 1] == undefined ? callback(true) : loop();
                  });
                }

                participantsOrErrorMessage[x] == undefined ? callback(true) : loop();
              }
            });
          }
        });
      }
    });
  }
}

/****************************************************************************************************/