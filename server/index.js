const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const userController = require('./controllers/userController');
const locationController = require('./controllers/locationController');
const apiRouter = require('./routers/apiRouter');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use((req, res, next) => {
  console.log('req');
  return next();
});
if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

app.use('/api', apiRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.log(`MIDDLEWARE ERROR: ${err}`);
  err.myMessage ? console.log(err.myMessage) : null;
  res.status(err.status || 500).send(JSON.stringify(err.myMessage || 'Internal Server Error'));
});

module.exports = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
