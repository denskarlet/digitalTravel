const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const { client_id, client_secret, redirect_uri, mySecret } = require('../../secret');
const db = require('../db');

const userController = {};

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
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = await jwt.sign({ access_token, exp }, mySecret);
    const refresh = await jwt.sign({ refresh_token }, mySecret);
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
    const encoded = await jwt.verify(refresh, mySecret);
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
    const token = await jwt.sign({ access_token, exp }, mySecret);
    res.cookie('token', token);
    return next();
  } catch (err) {
    return next(err);
  }
};

userController.getUserData = async (req, res, next) => {
  const encrypted = await jwt.verify(req.cookies.token, mySecret);
  const { access_token } = encrypted;
  fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      const { email, display_name } = data;
      const imgUrl = data.images[0].url;
      res.locals.userData = { email, name: display_name, imgUrl };
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userController.verify = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    await jwt.verify(token, mySecret);
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return userController.refreshToken(req, res, next);
    }
    return res.sendStatus(403);
  }
};

userController.find = async (req, res, next) => {
  const { email } = res.locals.userData;
  if (!email) return res.sendStatus(400);
  const query = `SELECT * FROM users WHERE email='${email}'`;
  try {
    const response = await db.query(query);
    const user = response.rows[0];
    if (!user) return userController.create(req, res, next);
    res.locals.userData = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
userController.create = async (req, res, next) => {
  const { name, email, imgUrl } = res.locals.userData;
  if (!name || !email) return res.sendStatus(400);
  const query = `INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3) RETURNING *`;
  const values = [`${name}`, `${email}`, `${imgUrl}`];
  try {
    const response = await db.query(query, values);
    const user = response.rows[0];
    res.locals.userData = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = userController;
