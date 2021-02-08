const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { compare, genSalt, hash } = require('bcrypt');
const { sign, } = require('jsonwebtoken');
const config = require('config');
const sequelize = require('../../infrastructure/database');
const headerFiller = require('../../middlewares/headerFiller')

router.post('/login',
    [
      headerFiller,
        [
          body('email', 'Enter a valid email')
            .isEmail()
            .isLength({ max: 100 }),
          body('password', 'enter a password between 8 and 50 characters')
            .isLength({ min: 8, max: 50 }),
        ]
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const userForLogin = req.body;

        try {
            const user = await sequelize.models.user.findOne({
                raw: true,
                where: {
                    email: userForLogin.email
                },
            });

            if (!user)
                return res.status(401).send({ errors: [{ msg: 'Please check credentials' }] });

            if (!await compare(userForLogin.password, user.password))
                return res.status(401).send({ errors: [{ msg: 'Please check credentials' }] });

            const userHasRole = await sequelize.models.user_has_role.findOne({
                raw: true,
                where: {
                    isActive: true,
                    userId: user.id
                }
            })

            let role;
            if (!userHasRole) {
                role = 1;
            } else {
                const userRole = await sequelize.models.role.findOne({
                    raw: true,
                    where: {
                        id: userHasRole.roleId
                    }
                })

                if (!userRole) {
                    role = 1;
                } else {
                    role = userRole.id
                }
            }

            const { id, displayName, email, serverCode } = user;

            const payload = { user: { id, displayName, email, serverCode, role } };

            sign(
                payload,
                config.get('jwtSecretKey'),
                {
                    expiresIn: 36000,
                },
                (error, token) => {
                    if (error)
                        return res.status(500).json({ errors: [{ msg: 'Internal error' }] });

                    res.json({ token });
                });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: 'Internal error' }] });
        }
    });

router.post('/register',
    [
      headerFiller,
      [
          body('displayName', 'Display name is required')
            .notEmpty()
            .isLength({ max: 100 }),
          body('email', 'Valid email is required')
            .notEmpty()
            .isLength({ max: 100 }),
          body('password', 'Enter a password between 5 and 50 characters')
            .isLength({ min: 5, max: 50 }),
          body('serverCode', 'Enter a server code')
            .notEmpty()
            .isInt()
      ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.errors[0].msg });

        const userForRegister = req.body;

        const userByEmail = await sequelize.models.user.findOne({
            raw: true,
            where: {
                email: userForRegister.email
            }
        })
        console.log(userByEmail)

        if (userByEmail) {
            console.log("yeet")
            return res.status(418).json({errors: "User already exists"})
        }

        const userByName = await sequelize.models.user.findOne({
            raw: true,
            where: {
                displayName: userForRegister.displayName
            }
        })
        console.log(userByName)
        if (userByName) {
            console.log("yeet")
            return res.status(418).json({errors: "User already exists"})
        }
        console.log(userForRegister.serverCode);

        if (userForRegister.serverCode !== "0") {
            const userByServerCode = await sequelize.models.user.findOne({
                raw: true,
                where: {
                    serverCode: userForRegister.serverCode
                }
            })

            if (userByServerCode) {
                console.log("yeet")
                return res.status(418).json({errors: "User already exists"})
            }
        }

        const transaction = await sequelize.transaction();

        try {
            const salt = await genSalt(10);

            userForRegister.password = await hash(userForRegister.password, salt);

            const user = await sequelize.models.user.create({
                displayName: userForRegister.displayName,
                email: userForRegister.email,
                password: userForRegister.password,
                serverCode: userForRegister.serverCode,
                registerDate: Date.now()
            }, { transaction });

            transaction.commit();

            res.status(200).json({ response: 'Success! You are now registered' });
        } catch (error) {
            console.log(error)
            transaction.rollback();
            res.status(500).json({ errors: [{ msg: 'Internal error' }] })
        }
    });

module.exports = router;
