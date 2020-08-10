const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');
const MyError = require('../util/myError');

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
  try {
    const { lat, lon, country, city } = req.query;
    if (!lat || !lon || !country || !city)
      throw new MyError(400, 'Ensure all the query parameters are provided');

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
  } catch (err) {
    return next(err);
  }
};

locationController.parseData = (req, res, next) => {
  try {
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
  } catch (err) {
    return next(err);
  }
};

locationController.getLocationId = async (req, res, next) => {
  try {
    const { country, city } = req.body;
    if (!country || !city) throw new MyError(400, 'Ensure both city and country are provided');
    let { location_id } = await dbFindLocation(city, country);
    if (!location_id) {
      const createdLocation = await dbCreateLocation(city, country);
      location_id = createdLocation.location_id;
    }
    res.locals.location_id = location_id;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = locationController;
