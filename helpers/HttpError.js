const errorMessageList = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

class HttpError extends Error {
  constructor(statusCode, message = errorMessageList[statusCode]) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = HttpError;
