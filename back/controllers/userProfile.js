const userProfile = require('../models/userProfile');
const mysql = require('../db');
const fs = require('fs');

// Creating user's profile
exports.createProfile = (req, res) => {
    const { userId, name, username, bio, banner, date } = JSON.parse(
        req.body.profile
    );
    const profilePicture = `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
    }`;
    const Profile = new userProfile(
        userId,
        name,
        username,
        bio,
        profilePicture,
        banner,
        date
    );
    mysql.query(
        'SELECT * FROM userprofiles WHERE username = ? ',
        username,
        (error, results) => {
            if (error) {
                res.json({ error });
            } else {
                if (results != 0) {
                    return res
                        .status(404)
                        .json({ errror: "Nom d'utilisateur déjà utilisé!" });
                } else {
                    mysql.query(
                        'INSERT INTO userProfiles SET ?',
                        Profile,
                        (error) => {
                            if (error) {
                                res.json({ error });
                            } else {
                                res.json({ message: 'Profil crée', Profile });
                            }
                        }
                    );
                }
            }
        }
    );
};

// Modifying user's profile
exports.modifyProfile = (req, res) => {
    if (req.body.name == '') {
        const sqlRequest = `UPDATE userProfiles SET bio = '${req.body.bio}' WHERE userId = ?`;
        mysql.query(sqlRequest, req.body.userId, (error) => {
            if (error) {
                res.json({ error });
            }
        });
    } else if (req.body.bio == '') {
        const sqlRequest = `UPDATE userProfiles SET name = '${req.body.name}' WHERE userId = ?`;
        mysql.query(sqlRequest, req.body.userId, (error) => {
            if (error) {
                res.json({ error });
            }
        });
    } else {
        const sqlRequest = `UPDATE userProfiles SET name = '${req.body.name}', bio = '${req.body.bio}' WHERE userId = ?`;
        mysql.query(sqlRequest, req.body.userId, (error) => {
            if (error) {
                res.json({ error });
            }
        });
    }
    mysql.query(
        `SELECT * FROM userProfiles WHERE userId = ?`,
        req.body.userId,
        (error, results) => {
            if (error || results == 0) {
                res.json({ error });
            } else {
                res.status(200).json(results);
            }
        }
    );
};

exports.uploadAvatar = (req, res) => {
    const userId = req.body.userId;
    const profilePicture = `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
    }`;
    console.log(userId);
    console.log(profilePicture);
    mysql.query(
        `SELECT * FROM userProfiles WHERE userId = ?`,
        userId,
        (error, results) => {
            if (error || results == 0) {
                res.json({ error });
            } else {
                console.log(results);
                if (results[0].profilePicture != null) {
                    const filename =
                        results[0].profilePicture.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        const sqlRequest = `UPDATE userProfiles SET profilePicture = '${profilePicture}' WHERE userId = ?`;
                        mysql.query(sqlRequest, userId, (error) => {
                            if (error) {
                                res.json({ error });
                            } else {
                                res.status(200).json(profilePicture);
                            }
                        });
                    });
                } else {
                    const sqlRequest = `UPDATE userProfiles SET profilePicture = '${profilePicture}' WHERE userId = ?`;
                    mysql.query(sqlRequest, userId, (error) => {
                        if (error) {
                            res.json({ error });
                        } else {
                            res.status(200).json(profilePicture);
                        }
                    });
                }
            }
        }
    );
};

exports.uploadBanner = (req, res) => {
    const userId = req.body.userId;
    const banner = `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
    }`;
    console.log(userId);
    console.log(banner);
    mysql.query(
        `SELECT * FROM userProfiles WHERE userId = ?`,
        userId,
        (error, results) => {
            if (error || results == 0) {
                res.json({ error });
            } else {
                if (results[0].banner != null) {
                    const filename = results[0].banner.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        const sqlRequest = `UPDATE userProfiles SET banner = '${banner}' WHERE userId = ?`;
                        mysql.query(sqlRequest, userId, (error) => {
                            if (error) {
                                res.json({ error });
                            } else {
                                res.status(200).json(banner);
                            }
                        });
                    });
                } else {
                    const sqlRequest = `UPDATE userProfiles SET banner = '${banner}' WHERE userId = ?`;
                    mysql.query(sqlRequest, userId, (error) => {
                        if (error) {
                            res.json({ error });
                        } else {
                            res.status(200).json(banner);
                        }
                    });
                }
            }
        }
    );
};

// Deleting user's profile
exports.deleteProfile = (req, res) => {
    // let imageUrl = `${req.protocol}://${req.get('host')}/images/${
    //     req.file.filename
    // }`;
    const sqlRequest = `DELETE FROM userProfiles WHERE userId = ?`;
    mysql.query(sqlRequest, req.body.userId, (error) => {
        if (error) {
            res.json({ error });
        } else {
            res.json({ message: 'Profil supprimé' });
        }
    });
};

exports.getOneProfile = (req, res) => {
    const sqlRequest = `SELECT * FROM userProfiles WHERE userId = ?`;
    mysql.query(sqlRequest, req.params.id, (error, results) => {
        if (error || results == 0) {
            res.json({ error });
        } else {
            res.status(200).json(results);
        }
    });
};
