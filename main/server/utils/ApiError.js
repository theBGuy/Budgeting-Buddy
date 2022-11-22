class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
      stack = this.stack;
    }
    let stackLog = [];
    stack = stack.split("\n");

    if (stack && typeof stack === "object") {
      stack.reverse();
    }

    for (let i = 0; i < stack.length; i += 1) {
      if (stack[i]) {
        stackLog.push(stack[i].trim());
      }
    }

    this.stack = stackLog.slice();
  }
}

module.exports = ApiError;