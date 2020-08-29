// const { dbCreateLocation, dbFindLocation } = require('./locationHelpers');
// const {
//   dbFindUser,
//   dbCreateUser,
//   dbAddFavorite,
//   dbRemoveFavorite,
//   dbGetFavorites,
// } = require('./userHelpers');
const locationDbHelper = require('./locationHelpers');

const userDbHelper = require('./userHelpers');

module.exports = { ...locationDbHelper, ...userDbHelper };
