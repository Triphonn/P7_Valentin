const Post = require('../models/post');
const postDraft = require('../models/postdraft');
const fs = require('fs');
const mysql = require('../db');

exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    // Image added in ./images
    const post = new Post({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });
    // Saved in DB
    mysql.query('INSERT INTO posts SET ?', post, (error) => {
        if (error) {
            res.json({ error });
        } else {
            res.json({ message: 'Post crée' });
        }
    });
};

exports.saveDraft = (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (req.file != null) {
        const { userId, postText } = JSON.parse(req.body.content);
        console.log(userId);
        console.log(postText);
        const imageContent = `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`;
        const Draft = new postDraft(userId, postText, imageContent);
        mysql.query('INSERT INTO postDrafts SET ?', Draft, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Votre brouillon a été sauvegardé' });
            }
        });
    } else {
        const { userId, postText } = req.body;
        const noImageDraft = new postDraft(userId, postText);
        mysql.query('INSERT INTO postDrafts SET ?', noImageDraft, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Votre brouillon a été sauvegardé' });
            }
        });
    }
};

// exports.modifyPost = (req, res, next) => {
//     // If user updates ImageFile, it updates in DB too
//     const postObject = req.file
//         ? {
//               ...JSON.parse(req.body.post),
//               imageUrl: `${req.protocol}://${req.get('host')}/images/${
//                   req.file.filename
//               }`,
//           }
//         : { ...req.body };
//     // Updating sauceData in DB
//     Post.updateOne(
//         { _id: req.params.id },
//         { ...sauceObject, _id: req.params.id }
//     )
//         .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
//         .catch((error) => res.status(400).json({ error }));
// };

exports.deletePost = (req, res, next) => {
    // Deleting sauceData in DB
    const sqlRequest = `DELETE FROM posts WHERE _id = ?`;
    mysql
        .query(sqlRequest, req.params.id, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Post supprimé' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    const sqlRequest = `SELECT * FROM posts WHERE _id = ?`;
    mysql.query(sqlRequest, req.params.id, (error, results) => {
        if (error || results == 0) {
            res.json({ error });
        } else {
            res.status(200).json(results);
        }
    });
};

// Showing all posts registered in DB
exports.getAllPosts = (req, res, next) => {
    const sqlRequest = `SELECT * FROM posts`;
    mysql.query(sqlRequest, (error, results) => {
        if (error || results == 0) {
            res.json({ error });
        } else {
            res.status(200).json(results);
        }
    });
};
