const express = require('express');
const { query, check } = require('express-validator');

const locationController = require('../controllers/locationController');
const userController = require('../controllers/userController');
const validatorController = require('../controllers/validatorController');

const { getFavorites } = require('../controllers/userController');
const { firstLetterToUpper } = require('../helpers');
const db = require('../db');

const router = express.Router();
router.get(
  '/currentlocation',
  [query('lat').exists(), query('lng').exists()],
  validatorController.checkValidation,
  userController.verify,
  locationController.getCurrentGeo,
  locationController.parseCurrentLocationData,
  (req, res) => {
    res.status(200).json(res.locals.location);
  }
);
router.post(
  '/favorites',
  locationController.getLocationId,
  userController.addFavorite,
  (req, res) => {
    res.status(200).json(res.locals.favorite);
  }
);
router.delete('/favorites/:favorite_id', userController.removeFavorite, (req, res) => {
  res.status(200).json(res.locals.removed);
});
router.get('/favorites/:id', getFavorites, (req, res) => {
  res.status(200).json(res.locals.favorites);
});

router.get(
  '/user',
  userController.verify,
  userController.getUserData,
  userController.findOrCreate,
  (req, res) => {
    res.status(200).json(res.locals.userData);
  }
);
router.get('/verify', userController.verify, (req, res) => {
  res.sendStatus(200);
});

router.get(
  '/location',
  [
    query('city').exists().customSanitizer(firstLetterToUpper),
    query('country').exists().customSanitizer(firstLetterToUpper),
    query('lat').exists(),
    query('lng').exists(),
  ],
  validatorController.checkValidation,
  userController.verify,
  locationController.getLocationData,
  locationController.parseLocationData,
  (req, res) => {
    res.status(200).json({ ...res.locals.locationData });
  }
);
router.get('/authenticate', userController.redirectToSpotify);
router.get('/authorize', userController.authorize, (req, res) => res.redirect('/'));

module.exports = router;
