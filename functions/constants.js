/****************************************************************************************************/

const DATABASE_QUERY_ERROR                                                                    = 10001;
const ACCOUNT_NOT_FOUND                                                                       = 10002;
const EVENT_NOT_FOUND                                                                         = 10003;
const NOT_A_PARTICIPANT_OF_CURRENT_EVENT                                                      = 10004;
const MISSING_DATA_IN_QUERY                                                                   = 10005;
const BAD_FORMAT                                                                              = 10006;
const ALREADY_A_PARTICIPANT                                                                   = 10007;
const EVENT_CREATOR_CANNOT_BE_REMOVED_FROM_PARTICIPANTS                                       = 10008;
const ACCOUNT_EMAIL_IS_NOT_EVENT_CREATOR_EMAIL                                                = 10009;
const FRIEND_ALREADY_EXISTS                                                                   = 10010;
const FRIENDSHIP_NOT_FOUND                                                                    = 10011;
const FRIENDSHIP_NOT_IN_REJECTED_STATUS                                                       = 10012;
const FRIENDSHIP_NOT_DELETED                                                                  = 10013;
const FRIENDSHIP_STATUS_NOT_AUTHORIZED                                                        = 10014;
const AUTHENTICATION_TOKEN_REQUIRED                                                           = 10015;
const CANNOT_ADD_YOURSELF_AS_FRIEND                                                           = 10016;

/****************************************************************************************************/

module.exports =
{
  DATABASE_QUERY_ERROR: DATABASE_QUERY_ERROR,
  ACCOUNT_NOT_FOUND: ACCOUNT_NOT_FOUND,
  EVENT_NOT_FOUND: EVENT_NOT_FOUND,
  NOT_A_PARTICIPANT_OF_CURRENT_EVENT: NOT_A_PARTICIPANT_OF_CURRENT_EVENT,
  MISSING_DATA_IN_QUERY: MISSING_DATA_IN_QUERY,
  BAD_FORMAT: BAD_FORMAT,
  ALREADY_A_PARTICIPANT: ALREADY_A_PARTICIPANT,
  EVENT_CREATOR_CANNOT_BE_REMOVED_FROM_PARTICIPANTS: EVENT_CREATOR_CANNOT_BE_REMOVED_FROM_PARTICIPANTS,
  ACCOUNT_EMAIL_IS_NOT_EVENT_CREATOR_EMAIL: ACCOUNT_EMAIL_IS_NOT_EVENT_CREATOR_EMAIL,
  FRIEND_ALREADY_EXISTS: FRIEND_ALREADY_EXISTS,
  FRIENDSHIP_NOT_FOUND: FRIENDSHIP_NOT_FOUND,
  FRIENDSHIP_NOT_IN_REJECTED_STATUS: FRIENDSHIP_NOT_IN_REJECTED_STATUS,
  FRIENDSHIP_NOT_DELETED: FRIENDSHIP_NOT_DELETED,
  FRIENDSHIP_STATUS_NOT_AUTHORIZED: FRIENDSHIP_STATUS_NOT_AUTHORIZED,
  AUTHENTICATION_TOKEN_REQUIRED: AUTHENTICATION_TOKEN_REQUIRED,
  CANNOT_ADD_YOURSELF_AS_FRIEND: CANNOT_ADD_YOURSELF_AS_FRIEND
}