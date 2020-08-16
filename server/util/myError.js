module.exports = class myError extends Error {
  constructor(status, message, myMessage, error) {
    super(message);
    this.status = status;
    this.myMessage = myMessage;
    this.error = error;
  }
};
