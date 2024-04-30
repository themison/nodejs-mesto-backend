import ServerResponseStatutesEnum from '../helpers/server-response-statuses.enum';

export class NotAuthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ServerResponseStatutesEnum.NOT_AUTHORIZED;
  }
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ServerResponseStatutesEnum.BAD_REQUEST;
  }
}

export class NotAllowedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ServerResponseStatutesEnum.NOT_ALLOWED;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ServerResponseStatutesEnum.NOT_FOUND;
  }
}

export default class UniqueDataError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ServerResponseStatutesEnum.DATA_EXIST;
  }
}
