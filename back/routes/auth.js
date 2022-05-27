const express = require('express');
const router = express.Router();

const user = require('../controllers/auth');

router.post('/signup', user.signUp);
router.post('/login', user.login);

module.exports = router;
