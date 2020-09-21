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

const userController = {
  redirectToSpotify: (req, res, next) => {
    return res.redirect(linkToSpotify);
  },

  authorize: async (req, res, next) => {
    try {
      const { access_token, refresh_token } = await spotifyAuthorize(req.query.code);
      const exp = calculateExpiration();
      res.cookie('token', jwt.sign({ access_token, exp }, mySecret));
      res.cookie('refresh', jwt.sign({ refresh_token }, mySecret), { httpOnly: true });
      return next();
    } catch (err) {
      return next(err);
    }
  },

  refreshToken: async (req, res, next) => {
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
  },
  getUserData: async (req, res, next) => {
    try {
      const accessToken = res.locals.userData;
      res.locals.userData = await fetchUserData(accessToken);
      return next();
    } catch (err) {
      return next(err);
    }
  },

  verify: async (req, res, next) => {
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
  },

  findOrCreate: async (req, res, next) => {
    try {
      const { name, email, imgUrl } = res.locals.userData;
      let user = await dbFindUser(email);
      if (!user) user = await dbCreateUser({ email, name });
      res.locals.userData = { ...user, image_url: imgUrl };
      return next();
    } catch (err) {
      return next(err);
    }
  },

  getFavorites: async (req, res, next) => {
    try {
      const { id } = req.params;
      res.locals.favorites = await dbGetFavorites(id);
      return next();
    } catch (err) {
      return next(err);
    }
  },

  addFavorite: async (req, res, next) => {
    try {
      const userId = req.body.user_id;
      const { location } = res.locals;
      const favorite = await dbAddFavorite({ userId, location });
      res.locals.favorite = { ...location, ...favorite };
      return next();
    } catch (err) {
      return next(err);
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const favoriteId = req.params.favorite_id;
      res.locals.removed = await dbRemoveFavorite(favoriteId);
      return next();
    } catch (err) {
      return next(err);
    }
  },
};
module.exports = userController;
