const CustomError = require('./error');
const Company = require('./company');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const csv = require('csv-parser');

const login = async (req, res, next) => {
  const {
    body: { username, password },
  } = req;

  if (!username || !password) {
    throw new CustomError(400, 'Bad Request');
  }
  const found = await Company.findOne({
    where: {
      username,
    },
  });
  if (!found) {
    throw new CustomError(400, "User doesn't exists");
  }
  const valid = await bcrypt.compare(password, found.password);
  if (!valid) {
    throw new CustomError(400, 'Invalid credentials. Please try again.');
  }
  const token = jwt.sign(
    {
      id: found.id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: '1y',
    }
  );
  res.status(200).json({
    token,
  });
};

const getFile = async (req, res, next) => {
  const licenses = [];

  if (fs.existsSync('licenses.csv')) {
    fs.createReadStream('licenses.csv')
      .pipe(csv())
      .on('data', (license) => {
        licenses.push(license);
      })
      .on('end', () => {
        res.status(200).json({
          licenses,
        });
      });
  } else {
    throw new CustomError(500, 'Error obtaining CSV file. Please try again later.');
  }
};

module.exports = {
  login,
  getFile,
};
