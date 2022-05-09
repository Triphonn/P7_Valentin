const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db');
const { users } = db;

// Signup user
exports.signUp = async (req, res) => {
    try {
        const user = await users.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (user) {
            return res.status(404).json({ errror: 'Email déjà utilisé!' });
        } else {
            bcrypt
                // Hashing password
                .hash(req.body.password, 10)
                .then((hash) => {
                    // Creating userData in DB
                    users.create({
                        email: req.body.email,
                        password: hash,
                    });
                    res.status(201).json({
                        message: 'Votre compte a été crée',
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const user = await users.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            res.status(404).json({ errror: 'Utilisateur non trouvé !' });
        } else {
            bcrypt
                // Check password security
                .compare(req.body.password, user.password)
                .then((valid) => {
                    // If password is wrong return error
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: 'Mot de passe incorrect !' });
                    }
                    // If the password is valid, connect the user
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.AUTH_TOKEN,
                        {
                            expiresIn: '24h',
                        }
                    );
                    res.status(201).json({
                        userId: user.id,
                        token,
                        isLoggedIn: true,
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
