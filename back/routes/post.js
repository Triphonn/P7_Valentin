const express = require('express');
const router = express.Router();

const post = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/create', auth, multer, post.createPost);
router.post('/:id/comment', auth, multer, post.commentOnePost);
router.post('/modify', auth, multer, post.modifyPost);
router.post('/deletePostImage', auth, post.deletePostImage);
router.post('/delete', auth, post.deletePost);
router.post('/like/:id', post.likeOnePost);
router.get('/getAllLikes', post.getAllLikes);
router.get('/:username/:id', post.getOnePost);
router.get('/getcomments/:id/coms', post.getOnePostCommments);
router.get('/getAllPosts', post.getAllPosts);
router.get('/getAllPosts/:username', post.getPostsSingleUser);

module.exports = router;
