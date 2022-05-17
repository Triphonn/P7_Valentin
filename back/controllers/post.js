const fs = require('fs');
const db = require('../db');
const { posts, postdraft, userProfile, comments } = db;

exports.createPost = async (req, res) => {
    try {
        console.log(req.file);

        let userId = '';
        let postText = '';
        let image = '';
        let video = '';

        if (!req.file) {
            userId = req.body.userId;
            postText = req.body.postText;
        } else {
            const body = JSON.parse(req.body.content);
            userId = body.userId;
            postText = body.postText;
            if (req.file.mimetype.startsWith('video')) {
                console.log('test');
                video = `${req.protocol}://${req.get('host')}/videos/${
                    req.file.filename
                }`;
            } else {
                console.log('test2');
                image = `${req.protocol}://${req.get('host')}/images/${
                    req.file.filename
                }`;
            }
        }

        const profile = await userProfile.findByPk(userId);

        await posts.create({
            username: profile.username,
            name: profile.name,
            avatar: profile.profilePicture,
            content: postText,
            image: image,
            video: video,
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

exports.modifyPost = async (req, res) => {
    try {
        let postId = '';
        let content = '';
        let file = '';

        if (!req.file) {
            content = req.body.content;
            postId = req.body.postId;
        } else {
            const body = JSON.parse(req.body.content);
            postId = body.postId;
            content = body.content;
            file = `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`;
        }

        const post = await posts.findOne({
            where: { id: postId },
        });
        if (post.file) {
            if (req.file) {
                const filename = post.file.split('/images/')[1];
                fs.unlink(`images/${filename}`, async () => {
                    await post.update({
                        content: content,
                        file: file,
                    });
                });
            } else {
                await post.update({
                    content: content,
                });
            }
        } else {
            if (req.file) {
                const filename = post.file.split('/images/')[1];
                fs.unlink(`images/${filename}`, async () => {
                    await post.update({
                        content: content,
                        file: file,
                    });
                });
            } else {
                await post.update({
                    content: content,
                });
            }
        }

        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.deletePostImage = async (req, res) => {
    try {
        const post = await posts.findOne({
            where: { id: req.body.postId },
        });
        let filename = '';
        let file = '';
        if (post.video) {
            filename = post.video.split('/videos/')[1];
            file = 'videos';
        } else {
            file = 'images';
            filename = post.image.split('/images/')[1];
        }
        fs.unlink(`${file}/${filename}`, async () => {
            if (post.video) {
                await post.update({
                    video: '',
                });
            } else {
                await post.update({
                    image: '',
                });
            }
        });

        res.status(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await posts.findOne({
            where: { id: req.body.postId },
        });
        if (post.video || post.image) {
            let filename = '';
            let file = '';
            if (post.video) {
                filename = post.video.split('/videos/')[1];
                file = 'videos';
            } else {
                filename = post.image.split('/images/')[1];
                file = 'images';
            }
            fs.unlink(`${file}/${filename}`, async () => {
                await post.destroy();
            });
        } else {
            await post.destroy();
        }

        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
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
        const comment = await comments.findAll({
            where: {
                postId: req.params.id,
            },
        });
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
