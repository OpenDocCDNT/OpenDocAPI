const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');
const {
    compare,
    genSalt,
    hash
} = require('bcrypt');
const {
    sign,
} = require('jsonwebtoken');
const config = require('config');
const sequelize = require('../../infrastructure/database');
const headerFiller = require('../../middlewares/headerFiller')

router.post('/login',
    [
        headerFiller,
        [
            body('email', 'Enter a valid email')
            .isEmail()
            .isLength({
                max: 100
            }),
            body('password', 'enter a password between 8 and 50 characters')
            .isLength({
                min: 8,
                max: 50
            }),
        ]
    ],
    async (req, res) => {
        console.log('yeet')

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array()
            });

        const userForLogin = req.body;

        try {
            const user = await sequelize.models.user.findOne({
                raw: true,
                where: {
                    email: userForLogin.email
                },
            });

            if (!user)
                return res.status(401).send({
                    errors: [{
                        msg: 'Please check credentials'
                    }]
                });

            if (!await compare(userForLogin.password, user.password))
                return res.status(401).send({
                    errors: [{
                        msg: 'Please check credentials'
                    }]
                });

            const {
                id,
                username,
                email,
                registerDate
            } = user;

            const payload = {
                user: {
                    id,
                    username,
                    email,
                    registerDate
                }
            };

            sign(
                payload,
                config.get('jwtSecretKey'), {
                    expiresIn: 36000,
                },
                (error, token) => {
                    if (error)
                        return res.status(500).json({
                            errors: [{
                                msg: 'Internal error'
                            }]
                        });

                    res.json({
                        token
                    });
                });
        } catch (error) {
            res.status(500).json({
                errors: [{
                    msg: 'Internal error'
                }]
            });
        }
    });

router.post('/register',
    [
        headerFiller,
        [
            body('username', 'Display name is required')
            .notEmpty()
            .isLength({
                max: 100
            }),
            body('email', 'Valid email is required')
            .notEmpty()
            .isLength({
                max: 100
            }),
            body('password', 'Enter a password between 5 and 50 characters')
            .isLength({
                min: 5,
                max: 50
            })
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.errors[0].msg
            });

        const userForRegister = req.body;

        const userByEmail = await sequelize.models.user.findOne({
            raw: true,
            where: {
                email: userForRegister.email
            }
        })

        if (userByEmail) {
            return res.status(418).json({
                errors: "User already exists"
            })
        }

        const userByName = await sequelize.models.user.findOne({
            raw: true,
            where: {
                username: userForRegister.username
            }
        })
        console.log(userByName)
        if (userByName) {
            return res.status(418).json({
                errors: "User already exists"
            })
        }

        const transaction = await sequelize.transaction();

        try {
            const salt = await genSalt(10);

            userForRegister.password = await hash(userForRegister.password, salt);

            const user = await sequelize.models.user.create({
                username: userForRegister.username,
                email: userForRegister.email,
                password: userForRegister.password,
                registerDate: Date.now()
            }, {
                transaction
            });

            transaction.commit();

            res.status(200).json({
                response: 'Success! You are now registered'
            });
        } catch (error) {
            console.log(error)
            transaction.rollback();
            res.status(500).json({
                errors: [{
                    msg: 'Internal error'
                }]
            })
        }
    });

module.exports = router;