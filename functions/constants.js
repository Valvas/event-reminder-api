/****************************************************************************************************/

const DATABASE_QUERY_ERROR                                                                    = 10001;
const ACCOUNT_NOT_FOUND                                                                       = 10002;
const EVENT_NOT_FOUND                                                                         = 10003;
const NOT_A_PARTICIPANT_OF_CURRENT_EVENT                                                      = 10004;
const MISSING_DATA_IN_QUERY                                                                   = 10005;
const BAD_FORMAT                                                                              = 10006;
const ALREADY_A_PARTICIPANT                                                                   = 10007;

/****************************************************************************************************/

module.exports =
{
  DATABASE_QUERY_ERROR: DATABASE_QUERY_ERROR,
  ACCOUNT_NOT_FOUND: ACCOUNT_NOT_FOUND,
  EVENT_NOT_FOUND: EVENT_NOT_FOUND,
  NOT_A_PARTICIPANT_OF_CURRENT_EVENT: NOT_A_PARTICIPANT_OF_CURRENT_EVENT,
  MISSING_DATA_IN_QUERY: MISSING_DATA_IN_QUERY,
  BAD_FORMAT: BAD_FORMAT,
  ALREADY_A_PARTICIPANT: ALREADY_A_PARTICIPANT
}