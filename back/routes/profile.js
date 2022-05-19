const express = require('express');
const router = express.Router();

const userProfile = require('../controllers/userProfile');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/create', auth, multer, userProfile.createProfile);
router.put('/modifyProfile', auth, userProfile.modifyProfile);
router.put('/uploadAvatar', auth, multer, userProfile.uploadAvatar);
router.put('/uploadBanner', auth, multer, userProfile.uploadBanner);
router.post('/delete', auth, userProfile.deleteProfile);
router.get('/getAllProfiles', userProfile.getAllProfiles);
router.get('/get/:username', userProfile.getOneProfile);
router.get('/verifyprofile/:id', auth, userProfile.verifyProfile);

module.exports = router;
