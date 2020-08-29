const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../db');
const MyError = require('./myError');

const fetchSpotifyApi = async (countryCode, accessToken) => {
  try {
    const url = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${countryCode}`;
    const reqOptions = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await fetch(url, reqOptions);
    return response.json();
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const fetchWeatherApi = async (lat, lng, key) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${key}`;
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const fetchCountryApi = async (country) => {
  try {
    let fixedCountry = country;
    if (country === 'UK') fixedCountry = 'GB';

    const url = `https://restcountries.eu/rest/v2/name/${fixedCountry}`;
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const parseSpotifyResponse = (obj, country) => {
  try {
    let fixedCountry = country;
    if (country === 'UK') fixedCountry = 'United Kingdom';
    if (country === 'USA') fixedCountry = 'United States';
    return obj.playlists.items.find((item) => item.name === `${fixedCountry} Top 50`).tracks.href;
  } catch (err) {
    return '';
  }
};
const parseWeatherResponse = (obj) => {
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
const parseCountryResponse = (obj) => {
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
module.exports = {
  parseCountryResponse,
  parseSpotifyResponse,
  parseWeatherResponse,
  fetchCountryApi,
  fetchSpotifyApi,
  fetchWeatherApi,
};
