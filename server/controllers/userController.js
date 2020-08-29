const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { client_id, client_secret, redirect_uri, mySecret, linkToSpotify } = require('../../secret');
const {
  fetchUserData,
  dbFindUser,
  dbCreateUser,
  dbGetFavorites,
  dbAddFavorite,
  dbRemoveFavorite,
  spotifyAuthorize,
  setJswCookie,
  calculateExpiration,
  spotifyGetRefreshToken,
} = require('../helpers');

const userController = {};

userController.redirectToSpotify = (req, res, next) => {
  return res.redirect(linkToSpotify);
};

userController.authorize = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = await spotifyAuthorize(req.query.code);
    const exp = calculateExpiration();
    res.cookie('token', jwt.sign({ access_token, exp }, mySecret));
    res.cookie('refresh', jwt.sign({ refresh_token }, mySecret), { httpOnly: true });
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.refreshToken = async (req, res, next) => {
  const { refresh } = req.cookies;
  if (!refresh) return res.sendStatus(403);
  try {
    const { refresh_token } = jwt.verify(refresh, mySecret);
    const { access_token } = await spotifyGetRefreshToken(refresh_token);
    const exp = calculateExpiration();
    res.cookie('token', jwt.sign({ access_token, exp }, mySecret));
    res.locals.userData = access_token;
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.getUserData = async (req, res, next) => {
  try {
    const accessToken = res.locals.userData;
    res.locals.userData = await fetchUserData(accessToken);
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.verify = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { access_token: accessToken } = jwt.verify(token, mySecret);
    res.locals.userData = accessToken;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return userController.refreshToken(req, res, next);
    }
    return res.sendStatus(403);
  }
};

userController.findOrCreate = async (req, res, next) => {
  try {
    const { name, email, imgUrl } = res.locals.userData;
    let user = await dbFindUser(email);
    if (!user) user = await dbCreateUser({ email, name, imgUrl });
    res.locals.userData = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.getFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.locals.favorites = await dbGetFavorites(id);
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.addFavorite = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const { location } = res.locals;
    const favorite = await dbAddFavorite({ user_id, location });
    res.locals.favorite = { ...location, ...favorite };
    return next();
  } catch (err) {
    return next(err);
  }
};
userController.removeFavorite = async (req, res, next) => {
  try {
    const { favorite_id } = req.params;
    res.locals.removed = await dbRemoveFavorite(favorite_id);
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = userController;
