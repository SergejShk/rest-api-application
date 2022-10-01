class CustomError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class WrongParametersError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class RegistrationConflictError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  CustomError,
  WrongParametersError,
  NotFoundError,
  UnauthorizedError,
  RegistrationConflictError,
};
