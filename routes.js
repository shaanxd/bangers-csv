const express = require('express');
const controllers = require('./controllers');
const wrap = require('./wrap');
const passport = require('passport');
const config = require('./passport');

const router = express.Router();

router.post('/authenticate', wrap(controllers.login));
router.post('/get-file', passport.authenticate('jwt', { session: false }), wrap(controllers.getFile));

module.exports = router;
