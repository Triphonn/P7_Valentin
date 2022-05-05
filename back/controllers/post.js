const Post = require('../models/post');
const postDraft = require('../models/postdraft');
const fs = require('fs');
const mysql = require('../db');

exports.createPost = (req, res) => {
    function between(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    if (req.file != null) {
        const { userId, postText } = JSON.parse(req.body.content);
        const file = `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`;
        const _id = between(1000000000000000, 1999999999999999);
        console.log(_id);
        const Draft = new Post(userId, _id, postText, file, 0, 0, '', '');
        console.log(Draft);
        mysql.query('INSERT INTO posts SET ?', Draft, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Votre publication a été sauvegardé' });
            }
        });
    } else {
        const { userId, postText } = req.body;
        const _id = between(1000000000000000, 1999999999999999);
        console.log('test 1 :' + _id);
        const noImageDraft = new Post(userId, _id, postText, '', 0, 0, '', '');
        console.log(noImageDraft);
        mysql.query('INSERT INTO posts SET ?', noImageDraft, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Votre publication a été sauvegardé' });
            }
        });
    }
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

// exports.modifyPost = (req, res) => {
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

exports.deletePost = (req, res) => {
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

exports.getOnePost = (req, res) => {
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
exports.getAllPosts = (req, res) => {
    const sqlRequest = `SELECT * FROM posts`;
    mysql.query(sqlRequest, (error, results) => {
        if (error || results == 0) {
            res.json({ error });
        } else {
            res.status(200).json(results);
        }
    });
};
