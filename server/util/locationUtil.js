const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');
const MyError = require('./myError');

exports.fetchSpotifyApi = (countryCode, access_token) => {
  try {
    const url = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${countryCode}`;
    const reqOptions = {
      headers: { Authorization: `Bearer ${access_token}` },
    };
    return fetch(url, reqOptions).then((res) => res.json());
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.fetchWeatherApi = (lat, lon, key) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${key}`;
    return fetch(url).then((res) => res.json());
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.fetchCountryApi = (country) => {
  try {
    const url = `https://restcountries.eu/rest/v2/name/${country}`;
    return fetch(url).then((res) => res.json());
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.parseSpotifyResponse = (obj, country) => {
  return obj.playlists.items.find((item) => item.name === `${country} Top 50`).tracks.href;
};
exports.parseWeatherResponse = (obj) => {
  return {
    weather: obj.weather[0].main,
    temp: obj.main.temp,
    feelsLike: obj.main.feels_like,
    tempMin: obj.main.temp_min,
    tempMax: obj.main.temp_max,
    humidity: obj.main.humidity,
    windSpeed: obj.wind.speed,
    sunrise: obj.sys.sunrise,
    sunset: obj.sys.sunset,
    timezone: obj.timezone,
  };
};
exports.parseCountryResponse = (obj) => {
  const {
    name,
    nativeName,
    alpha2Code,
    capital,
    region,
    area,
    population,
    languages,
    flag,
    borders,
    regionalBlocs,
  } = obj;
  return {
    regionalBlocs,
    nativeName,
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
};
exports.dbFindLocation = async (city, country) => {
  try {
    const query = `SELECT * FROM locations WHERE city_name='${city}' AND country_name='${country}'`;
    const { rows } = await db.query(query);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
exports.dbCreateLocation = async (city, country) => {
  try {
    const query = `INSERT INTO locations (country_name, city_name) VALUES ($1, $2) RETURNING*`;
    const values = [country, city];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    throw new MyError(500, err.message);
  }
};
