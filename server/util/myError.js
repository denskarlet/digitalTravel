module.exports = class myError extends Error {
  constructor(status, message, myMessage) {
    super(message);
    this.status = status;
    this.myMessage = myMessage;
  }
};
