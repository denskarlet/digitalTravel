const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { client_id, client_secret, redirect_uri, mySecret, weatherKey } = require('../../secret');

const getWeatherUrl = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${weatherKey}`;
};
const getCountryUrl = (name) => {
  return `https://restcountries.eu/rest/v2/name/${name}`;
};
const getSpotifyUrl = (code) => {
  return `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${code}`;
};
const locationController = {};

locationController.getLocationData = async (req, res, next) => {
  const { lat, lon, country, city } = req.body;
  const responses = await Promise.all([
    fetch(getWeatherUrl(lat, lon)),
    fetch(getCountryUrl(country)),
  ]);
  const result = await Promise.all(responses.map((response) => response.json()));
  const { alpha2Code } = result[1][0];
  const encrypted = await jwt.verify(req.cookies.token, mySecret);
  const { access_token } = encrypted;
  const spotifyResponse = await fetch(getSpotifyUrl(alpha2Code), {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const spotifyData = await spotifyResponse.json();
  res.locals.locationData = {
    weatherData: result[0],
    countryData: result[1],
    spotifyData,
  };
  return next();
};
locationController.parseData = (req, res, next) => {
  const { spotifyData, weatherData, countryData } = res.locals.locationData;
  const { country } = req.body;
  const playlist = spotifyData.playlists.items.find(
    (playlist) => playlist.name === `${country} Top 50`
  ).tracks.href;
  const weatherInfo = {
    weather: weatherData.weather[0].main,
    temp: weatherData.main.temp,
    feels_like: weatherData.main.feels_like,
    temp_min: weatherData.main.temp_min,
    temp_max: weatherData.main.temp_max,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezone: weatherData.timezone,
  };
  const [countryObj] = countryData;
  const {
    name,
    alpha2Code,
    capital,
    region,
    area,
    population,
    languages,
    flag,
    borders,
  } = countryObj;
  console.log(country);
  const countryInfo = {
    name,
    alpha2Code,
    capital,
    region,
    area,
    population,
    languages,
    flag,
    borders,
  };
  res.locals.locationData = {
    countryInfo,
    weatherInfo,
    playlist,
  };
  return next();
};

module.exports = locationController;
