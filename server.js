require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { PORT } = require('./config');
const { MONGODB_URI } = require('./config');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('./passport/strategies');
const jwtStrategy = require('./passport/jwt');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const equationRouter = require('./routes/equationRouter');
const User = require('./models/userModel');
mongoose.Promise = global.Promise;


const app = express();
// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/equation', equationRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

if (require.main === module) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;
