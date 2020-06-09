require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 8001;

const database = require('./database');
const Company = require('./company');
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

database
  .sync()
  .then((password) => {
    return Company.count();
  })
  .then((count) => {
    if (count == 0) {
      return Company.create({
        username: 'bangers',
        password: bcrypt.hashSync('12345', 10),
      });
    }
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Connection to database successful. Server is listening at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(
      `[ERROR]: Failed to connect to database. Please make sure to have a working connection and try again.`,
      err.message
    );
  });
