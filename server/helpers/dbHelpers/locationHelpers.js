const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const MyError = require('../myError');

const dbFindLocation = async (city, country) => {
  try {
    const query = `SELECT * FROM locations WHERE city='${city}' AND country='${country}'`;
    const { rows } = await db.query(query);
    if (!rows.length) return null;
    return rows[0];
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const dbCreateLocation = async ({ city, country, lat, lng }) => {
  try {
    const query = `INSERT INTO locations (country, city, lat, lng) VALUES ($1, $2, $3, $4) RETURNING*`;
    const values = [country, city, lat, lng];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

module.exports = { dbFindLocation, dbCreateLocation };
