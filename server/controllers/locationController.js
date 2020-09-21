const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');

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
  MyError,
  fetchGoogleApi,
} = require('../helpers');

const locationController = {};

locationController.getLocationData = async (req, res, next) => {
  try {
    const { lat, lng, country, city } = req.query;
    const [weatherData, [countryData]] = await Promise.all([
      fetchWeatherApi(lat, lng, weatherKey),
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

locationController.getCurrentGeo = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const googleLocation = await fetchGoogleApi(lat, lng);
    res.locals.location = googleLocation;
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
    const { country, city, lat, lng } = req.body;
    if (!country || !city || !lat || !lng) throw new MyError(400, 'Ensure all fields are provided');
    let location = await dbFindLocation(city, country);
    if (!location) {
      location = await dbCreateLocation({ city, country, lat, lng });
    }
    res.locals.location = location;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = locationController;
