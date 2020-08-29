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
} = require('../../../secret');

const db = require('../../db');
const MyError = require('../myError');

const dbFindUser = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email='${email}'`;
    const { rows } = await db.query(query);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const dbCreateUser = async ({ name, email, imgUrl }) => {
  try {
    const query = `INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3) RETURNING *`;
    const values = [name, email, imgUrl];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

const dbGetFavorites = async (userId) => {
  try {
    const query = `SELECT * FROM locations LEFT JOIN favorites ON locations.location_id=favorites.location_id WHERE user_id='${userId}'`;
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

const dbAddFavorite = async ({ location, userId }) => {
  try {
    const locationId = location.location_id;
    const query = `INSERT INTO favorites (user_id, location_id) VALUES ($1, $2) RETURNING *`;
    const values = [userId, locationId];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const dbRemoveFavorite = async (favoriteId) => {
  try {
    const query = `DELETE FROM favorites WHERE favorite_id='${favoriteId}' RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0] || {};
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

module.exports = { dbRemoveFavorite, dbAddFavorite, dbGetFavorites, dbCreateUser, dbFindUser };
