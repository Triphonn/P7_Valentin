const fs = require('fs');
const db = require('../db');
const { posts, userProfile, comments, likes } = db;

exports.createPost = async (req, res) => {
    try {
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
                video = `${req.protocol}://${req.get('host')}/videos/${
                    req.file.filename
                }`;
            } else {
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
        const userId = req.body.userId;
        const content = req.body.content;
        const postId = req.params.id;

        const profile = await userProfile.findByPk(userId);

        await comments.create({
            username: profile.username,
            name: profile.name,
            avatar: profile.profilePicture,
            postId: postId,
            content: content,
        });
        res.status(201).json({ message: 'Votre commentaire a été publié' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.likeOnePost = async (req, res) => {
    try {
        const post = await posts.findByPk(req.params.id);
        const like = await likes.findOne({
            where: { username: req.body.username, postId: req.params.id },
        });

        if (!like) {
            await likes.create({
                username: req.body.username,
                postId: req.params.id,
            });
            const likesAdded = parseInt(post.likes) + 1;
            await post.update({ likes: likesAdded });
            res.status(200).json({ message: 'Votre like a été ajouté' });
        }
        if (like) {
            await likes.destroy({
                where: {
                    username: req.body.username,
                    postId: req.params.id,
                },
            });
            const likesRemoved = parseInt(post.likes) - 1;
            await post.update({ likes: likesRemoved });
            res.status(200).json({ message: 'Votre like a été retiré' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.modifyPost = async (req, res) => {
    try {
        let postId = '';
        let content = '';
        let image = '';
        let video = '';

        console.log(req.file);

        if (!req.file) {
            content = req.body.content;
            postId = req.body.postId;
        } else {
            const body = JSON.parse(req.body.content);
            postId = body.postId;
            content = body.content;
            if (req.file.mimetype.startsWith('video')) {
                video = `${req.protocol}://${req.get('host')}/videos/${
                    req.file.filename
                }`;
            } else {
                image = `${req.protocol}://${req.get('host')}/images/${
                    req.file.filename
                }`;
            }
        }

        const post = await posts.findOne({
            where: { id: postId },
        });
        if (post.video || post.image) {
            console.log('test 1');
            if (req.file) {
                let filename = '';
                let file = '';
                if (post.video) {
                    console.log('test 2');
                    filename = post.video.split('/videos/')[1];
                    file = 'videos';
                } else {
                    console.log('test 3');
                    file = 'images';
                    filename = post.image.split('/images/')[1];
                }
                fs.unlink(`${file}/${filename}`, async () => {
                    if (video) {
                        console.log('test 4');
                        console.log(video);
                        await post.update({
                            content: content,
                            video: video,
                            image: '',
                        });
                    } else {
                        console.log('test 5');
                        await post.update({
                            content: content,
                            image: image,
                            video: '',
                        });
                    }
                });
            } else {
                console.log('test 6');
                await post.update({
                    content: content,
                });
            }
        } else {
            if (req.file) {
                console.log('test 7');
                if (video) {
                    console.log('test 8');
                    await post.update({
                        content: content,
                        video: video,
                    });
                } else {
                    console.log('test 9');
                    await post.update({
                        content: content,
                        image: image,
                    });
                }
            } else {
                console.log('test 10');
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

exports.deleteComment = async (req, res) => {
    try {
        console.log(req.body);
        await comments.destroy({
            where: { id: req.body.commentId, username: req.body.username },
        });

        res.status(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getAllLikes = async (req, res) => {
    try {
        const like = await likes.findAll();
        res.status(201).json(like);
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
            order: [['createdAt', 'DESC']],
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
            order: [['createdAt', 'DESC']],
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
            order: [['createdAt', 'DESC']],
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
