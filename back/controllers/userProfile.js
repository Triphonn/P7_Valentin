const bcrypt = require('bcrypt');
const db = require('../db');
const { users, posts, postdraft, userProfile, deletedaccount, comments } = db;
const fs = require('fs');

// Creating user's profile
exports.createProfile = async (req, res) => {
    try {
        const { userId, name, username, bio } = JSON.parse(req.body.profile);
        let profilePicture =
            'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg';
        if (req.file) {
            profilePicture = `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`;
        }
        const usernameCheck = await userProfile.findByPk(username);
        if (usernameCheck) {
            return res
                .status(404)
                .json({ errror: "Nom d'utilisateur déjà utilisé!" });
        } else {
            const Profile = await userProfile.create({
                userId: userId,
                name: name,
                username: username,
                bio: bio,
                profilePicture: profilePicture,
            });
            res.status(201).json({
                message: 'Votre profil a bien été crée',
                Profile,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Modifying user's profile
exports.modifyProfile = async (req, res) => {
    try {
        const user = await userProfile.findByPk(req.body.userId);
        const id = req.body.userId;
        const data = req.body;

        for (let key of Object.keys(data)) {
            if (!data[key]) {
                delete data[key];
            } else {
                await user.update(
                    {
                        [key]: data[key],
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );
                await posts.update(
                    {
                        [key]: data[key],
                    },
                    {
                        where: {
                            username: user.username,
                        },
                    }
                );
                await comments.update(
                    {
                        [key]: data[key],
                    },
                    {
                        where: {
                            username: user.username,
                        },
                    }
                );
            }
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.body.userId;
        const profilePicture = `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`;
        const user = await userProfile.findByPk(userId);
        if (
            user.profilePicture !=
            'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg'
        ) {
            const filename = user.profilePicture.split('/images/')[1];
            fs.unlink(`images/${filename}`, async () => {
                await user.update({
                    profilePicture: profilePicture,
                });
                await posts.update(
                    { avatar: profilePicture },
                    {
                        where: {
                            username: user.username,
                        },
                    }
                );
                await comments.update(
                    { avatar: profilePicture },
                    {
                        where: {
                            username: user.username,
                        },
                    }
                );
                res.status(200).json(profilePicture);
            });
        } else {
            await user.update({
                profilePicture: profilePicture,
            });
            res.status(200).json(profilePicture);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.uploadBanner = async (req, res) => {
    try {
        const userId = req.body.userId;
        const banner = `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`;
        const user = await userProfile.findByPk(userId);
        if (user.banner) {
            const filename = user.banner.split('/images/')[1];
            fs.unlink(`images/${filename}`, async () => {
                await user.update({
                    banner: banner,
                });
                res.status(200).json(banner);
            });
        } else {
            await user.update({
                banner: banner,
            });
            res.status(200).json(banner);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Deleting user's profile
exports.deleteProfile = async (req, res) => {
    try {
        const { userId, username, password } = req.body;
        const user = await users.findByPk(userId);
        const profileToDelete = await userProfile.findOne({
            where: {
                username: username,
            },
        });
        const profile = await userProfile.findOne({
            where: { userId: userId },
        });
        if (!profileToDelete) {
            res.status(404).json({ errror: 'Utilisateur non trouvé !' });
        } else {
            if (profile.username == username || user.isAdmin === 1) {
                bcrypt
                    // Check password security
                    .compare(password, user.password)
                    .then(async (valid) => {
                        // If password is wrong return error
                        if (!valid) {
                            return res
                                .status(401)
                                .json({ error: 'Mot de passe incorrect !' });
                        }

                        await userProfile.destroy({
                            where: { username: username },
                        });
                        await users.destroy({
                            where: { id: profileToDelete.userId },
                        });

                        await posts.destroy({
                            where: { username: username },
                        });

                        res.status(200).json({
                            message: 'Compte supprimé',
                        });
                    });
            } else {
                res.status(401).json('Non autorisé');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.desactivateProfile = async (req, res) => {
    try {
        const { userId, username, password } = req.body;
        const user = await users.findByPk(userId);
        if (!user) {
            res.status(404).json({ errror: 'Utilisateur non trouvé !' });
        } else {
            bcrypt
                // Check password security
                .compare(password, user.password)
                .then(async (valid) => {
                    // If password is wrong return error
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: 'Mot de passe incorrect !' });
                    }
                    const profile = await userProfile.findOne({
                        where: {
                            username: username,
                        },
                    });

                    await deletedaccount.create({
                        userId: profile.userId,
                        email: user.email,
                        name: profile.name,
                        username: profile.username,
                        bio: profile.bio,
                        profilePicture: profile.profilePicture,
                        banner: profile.banner,
                    });

                    await profile.destroy();
                    await user.destroy();

                    await posts.destroy({
                        where: { username: username },
                    });

                    await postdraft.destroy({
                        where: { _id: userId },
                    });
                    res.status(200);
                });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getOneProfile = async (req, res) => {
    try {
        const profile = await userProfile.findOne({
            where: {
                username: req.params.username,
            },
        });
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        const profile = await userProfile.findAll();
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.verifyProfile = async (req, res) => {
    try {
        const profile = await userProfile.findByPk(req.params.id);
        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ message: 'Profil non crée' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
