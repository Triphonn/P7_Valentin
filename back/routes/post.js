const express = require('express');
const router = express.Router();

const post = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/create', auth, post.createPost);
router.post('/savedraft', auth, multer, post.saveDraft);
// router.post('/modify', auth, post.modifyPost);
router.post('/delete', auth, post.deletePost);
router.get('/:username/status/:id', auth, post.getOnePost);
router.get('/', post.getAllPosts);

module.exports = router;
