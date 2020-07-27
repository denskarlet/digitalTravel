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
    res.cookie('refresh', refresh);
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

userController.getUserData = (req, res, next) => {
  // potentially with a helper function
  // pull out token from cookies and decrypt it
  // pass into bearer
  fetch('https://api.spotify.com/v1/me', {
    method: 'get',
    // headers: { Authorization: `Bearer ${}` }, // JWT token
  })
    .then((response) => response.json())
    .then((data) => {
      const { email, display_name } = data;
      res.locals.userData = { email, name: display_name };
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

userController.verify = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const encoded = await jwt.verify(token, mySecret);
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.redirect('/api/refresh');
    }
    return res.sendStatus(403);
  }
};

userController.find = async (req, res, next) => {
  const { email } = res.locals.userData;
  if (!email) return res.sendStatus(400);
  const query = `SELECT FROM users WHERE email = ${email}`;
  try {
    const response = await db.query(query);
    const user = response.rows[0];
    if (!user) return res.sendStatus(404);
    res.locals.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
userController.create = async (req, res, next) => {
  const { name, email } = res.locals.userData;
  if (!name || !email) return res.sendStatus(400);
  const query = `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`;
  const values = [`${name}`, `${email}`];
  try {
    const response = await db.query(query, values);
    const user = response.rows[0];
    res.locals.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = userController;

/*
  to store in the jwt:
  token, refresh token, user id(?)


 land on the page
 check exp of token and serve home if they are good, if not good -> redirect to refresh token that will redirect back home
 if no present - show login page

 if /home => check same logic

 before any edpoint check if token is gonna exp and refresh it

when user logs in -> grab data and find user in db, if no user -> make front end fetch for .post user




/auth endpoint will do spotify flow and jwt token and set a cookie
/ redirect to home
/ on load home will fetch for userdata endpoint which will get spotify data
/ and find user in DB and return all the data back
if no user found => CLIENT will have to fetch to post/user



user lands on / which will render login component that will check if user is loggen in(some front end flag)
if yes -> redirect to home

/ home will render home component that will fetch for user data and all that stuff
*idc if postman goes to /home because that will simply return index.html ???








*/
