module.exports = class myError extends Error {
  constructor(status, error, message, myMessage = null) {
    super(message);
    this.status = status;
    this.error = error;
    this.myMessage = myMessage;
  }
};
