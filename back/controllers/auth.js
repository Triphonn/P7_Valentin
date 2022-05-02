const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mysql = require('../db');
const User = require('../models/signup');

// Signup user
exports.signUp = (req, res) => {
    mysql.query(
        'SELECT * FROM user WHERE email = ? ',
        req.body.email,
        (error, results) => {
            if (error) {
                res.json({ error });
            } else {
                if (results != 0) {
                    return res
                        .status(404)
                        .json({ errror: 'Email déjà utilisé!' });
                } else {
                    bcrypt
                        // Hashing password
                        .hash(req.body.password, 10)
                        .then((hash) => {
                            // Creating userData in DB
                            const user = new User(req.body.email, hash);

                            mysql.query(
                                'INSERT INTO user SET ?',
                                user,
                                (error) => {
                                    if (error) {
                                        res.json({ error });
                                    } else {
                                        res.json({
                                            message: 'Utilisateur crée',
                                        });
                                    }
                                }
                            );
                        })
                        .catch((error) => res.status(500).json({ error }));
                }
            }
        }
    );
};

// Login user
exports.login = (req, res) => {
    mysql.query(
        'SELECT * FROM user WHERE email = ? ',
        req.body.email,
        (error, results) => {
            if (error) {
                res.json({ error });
            } else {
                if (results == 0) {
                    return res
                        .status(404)
                        .json({ errror: 'Utilisateur non trouvé !' });
                }
                bcrypt
                    // Check password security
                    .compare(req.body.password, results[0].password)
                    .then((valid) => {
                        // If password is wrong return error
                        if (!valid) {
                            return res
                                .status(401)
                                .json({ error: 'Mot de passe incorrect !' });
                        }
                        // If the password is valid, connect the user
                        const token = jwt.sign(
                            { userId: results[0].id },
                            process.env.AUTH_TOKEN,
                            {
                                expiresIn: '24h',
                            }
                        );
                        res.status(201).json({
                            userId: results[0].id,
                            token,
                            isLoggedIn: true,
                        });
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        }
    );
};

exports.verifyProfile = (req, res) => {
    const sqlRequest = `SELECT * FROM userprofiles WHERE userId = ?`;
    mysql.query(sqlRequest, req.params.id, (error, results) => {
        if (error || results == 0) {
            res.status(404).json({ error });
        } else {
            res.status(200).json(results);
        }
    });
};
