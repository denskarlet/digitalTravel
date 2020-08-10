const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { client_id, client_secret, redirect_uri, mySecret, linkToSpotify } = require('../../secret');

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
    console.log({ user_id, location_id });
    const values = [user_id, location_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbRemoveFavorite = async (favorite_id) => {
  try {
    const query = `DELETE FROM favorites WHERE favorite_id='${favorite_id}'`;
    return db.query(query);
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.fetchUserData = async (access_token) => {
  try {
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const { email, display_name } = data;
        const imgUrl = data.images[0].url;
        return { email, name: display_name, imgUrl };
      });
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.spotifyAuthorize = async (code) => {
  return fetch(
    `https://accounts.spotify.com/api/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  ).then((res) => res.json());
};
exports.calculateExpiration = () => {
  return Math.floor(Date.now() / 1000) + 60 * 60;
};
exports.spotifyGetRefreshToken = async (token) => {
  try {
    return fetch(
      `https://accounts.spotify.com/api/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${token}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then((res) => res.json());
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
