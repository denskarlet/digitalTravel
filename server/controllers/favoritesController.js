const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');

const favoritesController = {};

// should prolly go to user controller
favoritesController.addFavorite = async (req, res, next) => {
  const { user_id } = req.body;
  const { location_id } = res.locals.location;
  try {
    const query = `INSERT INTO favorites (user_id, location_id) VALUES ($1, $2) RETURNING *`;
    const values = [user_id, location_id];
    const response = await db.query(query, values);
    res.locals.favorite = response.rows[0].favorite_id;
    return next();
  } catch (err) {
    return next(err);
  }
};
// should probably go to user controller
favoritesController.removeFavorite = async (req, res, next) => {
  const { favorites_id } = req.params;
  const removeQuery = `DELETE FROM favorites WHERE favorite_id='${favorites_id}'`;
  try {
    await db.query(removeQuery);
    return next();
  } catch (err) {
    return next(err);
  }
};

// rename
favoritesController.findOrCreate = async (req, res, next) => {
  const { country, city } = req.body;
  try {
    const findQuery = `SELECT * FROM locations WHERE city_name='${city}' AND country_name='${country}'`;
    const findResponse = await db.query(findQuery);
    const result = findResponse.rows[0];
    if (!result) {
      const createQuery = `INSERT INTO locations (country_name, city_name) VALUES ($1, $2) RETURNING*`;
      const values = [country, city];
      const createResponse = await db.query(createQuery, values);
      res.locals.location = createResponse.rows[0];
    } else {
      res.locals.location = result;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = favoritesController;
