const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const userController = require('./controllers/userController');
const locationController = require('./controllers/locationController');
const favoritesController = require('./controllers/favoritesController');
const apiRouter = require('./routers/apiRouter');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
// app.use('*', (req, res, next) => {
//   console.log(req.originalUrl);
//   return next();
// });
if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}
app.get('/api/authenticate', userController.redirectToSpotify);
app.get('/api/authorize', userController.authorize, (req, res) => res.redirect('/'));
// app.get(
//   '/api/user',
//   userController.verify,
//   userController.getUserData,
//   userController.find,
//   userController.getFavorites,
//   (req, res) => {
//     res.status(200).json(res.locals.userData);
//   }
// );
// app.get(
//   '/api/location',
//   userController.verify,
//   locationController.getLocationData,
//   locationController.parseData,
//   (req, res) => {
//     res.status(200).json({ ...res.locals.locationData });
//   }
// );
// app.post(
//   '/api/favorites',
//   favoritesController.findOrCreate,
//   favoritesController.addFavorite,
//   (req, res) => {
//     res.status(200).json(res.locals.favorite);
//   }
// );
// app.delete('/api/favorites/:favorites_id', favoritesController.removeFavorite, (req, res) => {
//   res.status(200).json('deleted:)');
// });
app.use('/api', apiRouter);

// to post user
// app.post('/api/user', useContext.verify, ouathController.create);
// to get user info
// app.get('/api/user', userController.verify, userController.getUserData);
// to refresh token
// app.get('/api/refresh', userController.refreshToken);
// to get location info
// app.get('/api/location', userController.verify, () => {
//   console.log('another middleware from location controller');
// });

// Error Handler
app.use((err, req, res, next) => {
  console.log(`MIDDLEWARE ERROR: ${err.message}`);
  err.myMessage ? console.log(err.myMessage) : null;
  res.status(err.status || 500).send(JSON.stringify(err.myMessage || 'Internal Server Error'));
});

module.exports = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
