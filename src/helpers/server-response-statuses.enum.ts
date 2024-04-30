/* eslint-disable no-shadow */
enum ServerResponseStatutesEnum {
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
  NOT_AUTHORIZED = 401,
  BAD_REQUEST = 400,
  POST_SUCCESS = 201,
  SUCCESS = 200,
  NOT_ALLOWED = 403,
  DATA_EXIST = 409,
}

export default ServerResponseStatutesEnum;
