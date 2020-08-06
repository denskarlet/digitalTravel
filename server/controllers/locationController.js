const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');
const MyError = require('./myError');

const { client_id, client_secret, redirect_uri, mySecret, weatherKey } = require('../../secret');
const {
  fetchSpotifyApi,
  fetchWeatherApi,
  fetchCountryApi,
  parseCountryResponse,
  parseWeatherResponse,
  parseSpotifyResponse,
  dbFindLocation,
  dbCreateLocation,
} = require('../util/locationUtil');

const locationController = {};

locationController.getLocationData = async (req, res, next) => {
  const { lat, lon, country, city } = req.query;
  const [weatherData, [countryData]] = await Promise.all([
    fetchWeatherApi(lat, lon, weatherKey),
    fetchCountryApi(country),
  ]);
  const { alpha2Code } = countryData;
  const { access_token } = await jwt.verify(req.cookies.token, mySecret);
  const spotifyData = await fetchSpotifyApi(alpha2Code, access_token);
  res.locals.locationData = {
    weatherData,
    countryData,
    spotifyData,
  };
  return next();
};

locationController.parseData = (req, res, next) => {
  const { spotifyData, weatherData, countryData } = res.locals.locationData;
  const { country } = req.query;
  const playlist = parseSpotifyResponse(spotifyData, country);
  const weatherInfo = parseWeatherResponse(weatherData);
  const countryInfo = parseCountryResponse(countryData);
  res.locals.locationData = {
    countryInfo,
    weatherInfo,
    playlist,
  };
  return next();
};

locationController.getLocationId = async (req, res, next) => {
  try {
    const { country, city } = req.body;
    if (!country || !city) throw new MyError(400, 'Ensure both city and country are provided');
    let { location_id } = await DB_findLocation(city, country);
    if (!location_id) location_id = await DB_createLocation(city, country);
    res.locals.location_id = location_id;
    return next();
    // res.locals.location = createResponse.rows[0];
  } catch (err) {
    return next(err);
  }
};
// locationController.findDbEntry = async (req, res, next) => {
//   try {
//     const { country, city } = req.body;
//     if (!country || !city) res.sendStatus(400);
//     const query = `SELECT * FROM locations WHERE city_name='${city}' AND country_name='${country}'`;
//     const response = await db.query(query);
//     const result = response.rows[0];
//     if (!result) return locationController.createDbEntry(req, res, next);
//     res.locals.location = result;
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };
// locationController.findOrCreate = async (req, res, next) => {
//   const { country, city } = req.body;
//   try {
//     const findQuery = `SELECT * FROM locations WHERE city_name='${city}' AND country_name='${country}'`;
//     const findResponse = await db.query(findQuery);
//     const result = findResponse.rows[0];
//     if (!result) {
//       const createQuery = `INSERT INTO locations (country_name, city_name) VALUES ($1, $2) RETURNING*`;
//       const values = [country, city];
//       const createResponse = await db.query(createQuery, values);
//       res.locals.location = createResponse.rows[0];
//     } else {
//       res.locals.location = result;
//     }
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };

module.exports = locationController;
