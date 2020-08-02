const express = require('express');
const locationController = require('../controllers/locationController');
const userController = require('../controllers/userController');
const favoritesController = require('../controllers/favoritesController');

const router = express.Router();

router.post(
  '/favorites',
  favoritesController.findOrCreate,
  favoritesController.addFavorite,
  (req, res) => {
    res.status(200).json(res.locals.favorite);
  }
);
router.delete('/favorites/:favorites_id', favoritesController.removeFavorite, (req, res) => {
  res.sendStatus(200);
});

router.get(
  '/user',
  userController.verify,
  userController.getUserData,
  userController.find,
  userController.getFavorites,
  (req, res) => {
    res.status(200).json(res.locals.userData);
  }
);
router.get(
  '/location',
  userController.verify,
  locationController.getLocationData,
  locationController.parseData,
  (req, res) => {
    res.status(200).json({ ...res.locals.locationData });
  }
);

module.exports = router;
