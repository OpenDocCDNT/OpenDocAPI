const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');
const tokenValidator = require('../../middlewares/tokenValidator')
const config = require('config');
const sequelize = require('../../infrastructure/database');
const headerFiller = require('../../middlewares/headerFiller');


router.post('/create',
    [
        headerFiller,
        tokenValidator,
        [
            body('token', 'Token is required')
            .notEmpty(),
            body('label', 'Label is required')
            .notEmpty(),
            body('description', 'Description is required')
            .notEmpty()
        ]
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array()
            });

        const lessonToCreate = req.body
        const user = req.user

        const lessonExist = await sequelize.models.lesson.findOne({
            raw: true,
            where: {
                label: lessonToCreate.label
            }
        })

        if (lessonExist) {
            return res.status(418).json({
                errors: "Lesson already exist"
            })
        }

        const transaction = await sequelize.transaction();

        try {

            const newLesson = await sequelize.models.lesson.create({
                label: lessonToCreate.label,
                description: lessonToCreate.description,
                publishDate: Date.now(),
                userId: user.id
            }, {
                transaction
            });

            transaction.commit();

            res.status(200).json({
                response: 'Success! Lesson created !'
            });

        } catch (error) {
            console.log(error);
            transaction.rollback();
            res.status(500).json({
                errors: [{
                    msg: 'Internal error'
                }]
            })
        }

        console.log(lessons.every(lesson => lesson instanceof lesson));

        console.log("All Lessons : ", JSON.stringify(lessons, null, 2));

    });

router.post('/getAll',
    [
        headerFiller
    ],
    async (req, res) => {
        
        const lessons = await sequelize.models.lesson.findAll();
        res.json({ lessons });
    });

router.post('/:lessonId',
    [
        headerFiller,
        [
            body('displayName', 'Display name is required')
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
        console.log(userByEmail)

        if (userByEmail) {
            console.log("yeet")
            return res.status(418).json({
                errors: "User already exists"
            })
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
            return res.status(418).json({
                errors: "User already exists"
            })
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
                return res.status(418).json({
                    errors: "User already exists"
                })
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

// GET ONE
// UPDATE ONE 
// DELETE ONE 





module.exports = router;