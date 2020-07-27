const fetch = require('node-fetch');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const db = require('../db');

const client_id = '5358ef143b494a04a9234410230ddfc4';
const client_secret = 'fa985254b6e04bb79f5d574955d47c83';
const redirect_uri = 'http://localhost:8080/api/authorize';
const mySecret = 'somefuckingsecret';

const locationController = {};

locationController.getSpotify = (req, res, next) => {};
locationController.getWeather = (req, res, next) => {};
locationController.getWiki = (req, res, next) => {};

module.exports = locationController;
