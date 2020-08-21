const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const queryString = require('query-string');

const {
  client_id,
  client_secret,
  redirect_uri,
  mySecret,
  linkToSpotify,
  grant_type,
} = require('../../secret');

const db = require('../db');
const MyError = require('./myError');

exports.dbFindUser = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email='${email}'`;
    const { rows } = await db.query(query);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbCreateUser = async ({ name, email, imgUrl }) => {
  try {
    const query = `INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3) RETURNING *`;
    const values = [name, email, imgUrl];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbGetFavorites = async (user_id) => {
  try {
    const query = `SELECT * FROM favorites WHERE user_id='${user_id}'`;
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbAddFavorite = async ({ location_id, user_id }) => {
  try {
    const query = `INSERT INTO favorites (user_id, location_id) VALUES ($1, $2) RETURNING *`;
    const values = [user_id, location_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbRemoveFavorite = async (favorite_id) => {
  try {
    const query = `DELETE FROM favorites WHERE favorite_id='${favorite_id}' RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.fetchUserData = async (access_token) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const data = await response.json();
    const { email, display_name } = data;
    const imgUrl = data.images[0].url;
    return { email, name: display_name, imgUrl };
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.spotifyAuthorize = async (code) => {
  try {
    const params = queryString.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
    });
    const response = await fetch(`https://accounts.spotify.com/api/token?${params}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  } catch (err) {
    throw new MyError(500, err.message);
  }
};

exports.calculateExpiration = () => {
  return Math.floor(Date.now() / 1000) + 60 * 60;
};
exports.spotifyGetRefreshToken = async (refresh_token) => {
  try {
    const params = queryString.stringify({
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token',
    });
    const response = await fetch(`https://accounts.spotify.com/api/token?${params}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
