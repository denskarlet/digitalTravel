const express = require('express');
const locationController = require('../controllers/locationController');
const userController = require('../controllers/userController');
const { getFavorites } = require('../controllers/userController');

const router = express.Router();

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
  // userController.getFavorites,
  (req, res) => {
    res.status(200).json(res.locals.userData);
  }
);
router.get('/verify', userController.verify, (req, res) => {
  res.sendStatus(200);
});
router.get(
  '/location',
  userController.verify,
  locationController.getLocationData,
  locationController.parseData,
  (req, res) => {
    res.status(200).json({ ...res.locals.locationData });
  }
);
router.get('/authenticate', userController.redirectToSpotify);
router.get('/authorize', userController.authorize, (req, res) => res.redirect('/'));

module.exports = router;
