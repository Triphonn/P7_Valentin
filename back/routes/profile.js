const express = require('express');
const router = express.Router();

const userProfile = require('../controllers/userProfile');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/create', multer, userProfile.createProfile);
router.put('/modifyProfile', userProfile.modifyProfile);
router.put('/uploadAvatar', multer, userProfile.uploadAvatar);
router.put('/uploadBanner', multer, userProfile.uploadBanner);
router.post('/delete', userProfile.deleteProfile);
router.get('/:id', userProfile.getOneProfile);

module.exports = router;
