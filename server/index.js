const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const userController = require('./controllers/userController');

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
// will send user to spotify
app.get('/api/authenticate', userController.authenticate);
// will catch user coming back from spotify
app.get('/api/authorize', userController.authorize, (req, res) => res.redirect('/'));
app.get('/api/location', userController.verify, (req, res) => {
  res.status(200).send('YO WHATS UP GUCCI MAN');
});
app.get('/api/refresh', userController.refreshToken, (req, res) => {
  res.status(200).send('YAO NEW TAKEN');
});
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
  const defaultErr = {
    log: err,
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(`MIDDLEWARE ERROR: ${errorObj.log}`);
  res.status(errorObj.status).send(JSON.stringify(errorObj.log));
});

module.exports = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
