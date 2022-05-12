const { log } = require('console');
const fs = require('fs');
const db = require('../db');
const { posts, postdraft, userProfile, comments } = db;

exports.createPost = async (req, res) => {
    try {
        function between(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        let userId = '';
        let postText = '';
        let file = '';

        if (!req.file) {
            userId = req.body.userId;
            postText = req.body.postText;
        } else {
            const body = JSON.parse(req.body.content);
            userId = body.userId;
            postText = body.postText;
            file = `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`;
        }

        const profile = await userProfile.findByPk(userId);

        await posts.create({
            username: profile.username,
            name: profile.name,
            avatar: profile.profilePicture,
            content: postText,
            file: file,
        });
        res.status(201).json({ message: 'Votre publication a été publié' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.commentOnePost = async (req, res) => {
    try {
        let userId = '';
        let postId = '';
        let content = '';
        let file = '';

        if (!req.file) {
            userId = req.body.userId;
            content = req.body.content;
            postId = req.params.id;
        } else {
            const body = JSON.parse(req.body.content);
            userId = body.userId;
            content = body.content;
            postId = req.params.id;
            file = `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`;
        }

        const profile = await userProfile.findByPk(userId);

        await comments.create({
            username: profile.username,
            name: profile.name,
            avatar: profile.profilePicture,
            postId: postId,
            content: content,
            file: file,
        });
        res.status(201).json({ message: 'Votre commentaire a été publié' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.saveDraft = async (req, res) => {
    try {
        let userId = '';
        let postText = '';
        let imageContent = '';

        if (!req.file) {
            userId = req.body.userId;
            postText = req.body.postText;
            imageContent = null;
        } else {
            userId = JSON.parse(req.body.content.userId);
            postText = JSON.parse(req.body.content.postText);
            imageContent = `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`;
        }

        await postdraft.create({
            _id: userId,
            content: postText,
            file: imageContent,
        });
        res.status(201).json({ message: 'Votre brouillon a été sauvegardé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
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

exports.getOnePost = async (req, res) => {
    try {
        const post = await posts.findOne({
            where: {
                username: req.params.username,
                id: req.params.id,
            },
        });
        if (!post || post == null) {
            res.status(201).json(null);
        } else {
            res.status(201).json(post);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getOnePostCommments = async (req, res) => {
    try {
        console.log(req.params.id);
        const comment = await comments.findAll({
            where: {
                postId: req.params.id,
            },
        });
        console.log(comment);
        if (!comment || comment == null) {
            res.status(201).json(null);
        } else {
            res.status(201).json(comment);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Showing all posts registered in DB
exports.getAllPosts = async (req, res) => {
    try {
        const post = await posts.findAll({
            limit: 15,
            order: [['updatedAt', 'DESC']],
        });
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getPostsSingleUser = async (req, res) => {
    try {
        const post = await posts.findAll({
            where: {
                username: req.params.username,
            },
            limit: 15,
            order: [['updatedAt', 'DESC']],
        });
        // for (let i = 0; i < post.length; i++) {
        //     post[i].createdAt = post[i].createdAt
        //         .toISOString()
        //         .substring(0, 19)
        //         .split('T')
        //         .join(' ');
        // }
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
