const { validationResult } = require('express-validator');

const userController = {};
userController.checkValidation = (req, res, next) => {
  if (validationResult(req).errors.length) {
    return res.status(400).json('Ensure all the query parameters are provided');
  }
  return next();
};
module.exports = userController;
