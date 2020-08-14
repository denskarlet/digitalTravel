const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
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
} = require('../util/userHelper');

const db = require('../db');

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
  if (!refresh) return res.sendStatus(400);
  try {
    const { refresh_token } = jwt.verify(refresh, mySecret);
    const { access_token } = await spotifyGetRefreshToken(refresh_token);
    const exp = calculateExpiration();
    res.cookie('token', jwt.sign({ access_token, exp }, mySecret));
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.getUserData = async (req, res, next) => {
  try {
    const encrypted = jwt.verify(req.cookies.token, mySecret);
    const { access_token } = encrypted;
    res.locals.userData = await fetchUserData(access_token);
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.verify = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, mySecret);
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
    const { user_id } = res.locals.userData;
    res.locals.userData.favorites = await dbGetFavorites(user_id);
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.addFavorite = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const { location_id } = res.locals;
    res.locals.favorite = await dbAddFavorite({ user_id, location_id });
    return next();
  } catch (err) {
    return next(err);
  }
};
userController.removeFavorite = async (req, res, next) => {
  try {
    const { favorite_id } = req.params;
    await dbRemoveFavorite(favorite_id);
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = userController;
