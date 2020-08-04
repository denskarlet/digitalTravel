const express = require('express');
const locationController = require('../controllers/locationController');
const userController = require('../controllers/userController');
const favoritesController = require('../controllers/favoritesController');

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
  res.sendStatus(200);
});
router.get(
  '/user',
  userController.verify,
  userController.getUserData,
  userController.findOrCreate,
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
