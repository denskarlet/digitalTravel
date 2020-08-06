const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const { client_id, client_secret, redirect_uri, mySecret } = require('../..//secret');
const {
  fetchUserData,
  dbFindUser,
  dbCreateUser,
  dbGetFavorites,
  dbAddFavorite,
  dbRemoveFavorite,
} = require('../util/userDbUtil');
const db = require('../db');

const userController = {};
// think about having oauth controller separated
userController.authenticate = (req, res, next) => {
  const scopes = 'user-read-private user-read-email';

  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`
  );
};
userController.authorize = async (req, res, next) => {
  const body = {
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri,
  };
  try {
    const response = await superagent
      .post('https://accounts.spotify.com/api/token')
      .send(body)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const { access_token, refresh_token } = response.body;
    const exp = Math.floor(Date.now() / 1000);
    const token = jwt.sign({ access_token, exp }, mySecret);
    const refresh = jwt.sign({ refresh_token }, mySecret);
    res.cookie('token', token);
    res.cookie('refresh', refresh, { httpOnly: true });
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.refreshToken = async (req, res, next) => {
  const { refresh } = req.cookies;
  if (!refresh) return res.sendStatus(400);
  try {
    const encoded = jwt.verify(refresh, mySecret);
    const body = {
      client_id,
      client_secret,
      grant_type: 'refresh_token',
      refresh_token: encoded.refresh_token,
    };
    const response = await superagent
      .post('https://accounts.spotify.com/api/token')
      .send(body)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const { access_token } = response.body;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = jwt.sign({ access_token, exp }, mySecret);
    res.cookie('token', token);
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
// userController.create = async (req, res, next) => {
//   const { name, email, imgUrl } = res.locals.userData;
//   if (!name || !email) return res.sendStatus(400);
//   const query = `INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3) RETURNING *`;
//   const values = [name, email, imgUrl];
//   try {
//     const response = await db.query(query, values);
//     const user = response.rows[0];
//     res.locals.userData = user;
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };
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
// should probably go to user controller
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
