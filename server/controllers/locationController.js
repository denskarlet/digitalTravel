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

module.exports = locationController;
