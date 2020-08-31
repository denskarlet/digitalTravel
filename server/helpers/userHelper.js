// /* eslint-disable camelcase */
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
} = require('../../secret');
const db = require('../db');
const MyError = require('./myError');

const fetchUserData = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    const { email, display_name } = data;
    const imgUrl = data.images[0].url;
    return { email, name: display_name, imgUrl };
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};
const spotifyAuthorize = async (code) => {
  try {
    const params = queryString.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
    });
    const response = await fetch(`https://accounts.spotify.com/api/token?${params}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

const calculateExpiration = () => {
  return Math.floor(Date.now() / 1000) + 60 * 60;
};
const spotifyGetRefreshToken = async (refresh_token) => {
  try {
    const params = queryString.stringify({
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token',
    });
    const response = await fetch(`https://accounts.spotify.com/api/token?${params}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  } catch (err) {
    throw new MyError(500, err, err.message);
  }
};

module.exports = { calculateExpiration, spotifyAuthorize, spotifyGetRefreshToken, fetchUserData };
