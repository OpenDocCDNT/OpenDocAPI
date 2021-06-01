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
            .notEmpty(),
            body('difficulty', 'Difficulty is required')
              .notEmpty(),
            body('img', 'Image is required')
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

        if (lessonToCreate.img.size < 1) {
            return res.status(418).json({
                errors: "Image not valid"
            })
        }

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

            let newLessonId;

            const newLesson = await sequelize.models.lesson.create({
                label: lessonToCreate.label,
                description: lessonToCreate.description,
                difficulty: lessonToCreate.difficulty,
                publishDate: Date.now(),
                reputation: 0,
                userId: user.id,
                imgBlob: lessonToCreate.img
            }, {
                transaction
            })
              .then(newLessonObject => {
                  newLessonId = newLessonObject.id
              })

            transaction.commit();
            if (newLessonId) {
                res.status(200).json({
                    response: 'Success! Lesson created !',
                    lessonId: newLessonId
                });
            } else {
                res.status(200).json({
                    response: 'Success! Lesson created !'
                });
            }


        } catch (error) {
            console.log(error);
            transaction.rollback();
            res.status(500).json({
                errors: [{
                    msg: 'Internal error'
                }]
            })
        }

        //console.log(lessons.every(lesson => lesson instanceof lessons));

        //console.log("All Lessons : ", JSON.stringify(lessons, null, 2));

    });
router.post('/topLesson',
    [
        headerFiller
    ],
    async (req, res) => {
        try {
        const lessons = await sequelize.models.lesson.findAll({
            limit: 5,
            order: [['reputation', 'DESC']]
        });
        res.json({ lessons });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: 'Internal error' }] });
        }
    });

router.post('/getAll',
    [
        headerFiller
    ],
    async (req, res) => {
        const lessons = await sequelize.models.lesson.findAll();
        res.json({ lessons });
    });

router.post('/getOne',
    [
        headerFiller,
        [
            body('token', 'Token is required')
              .notEmpty(),
            body('lessonId', 'Id is required')
              .notEmpty()
              .isInt()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.errors[0].msg
            });

        const { lessonId } = req.body;

        if (!lessonId) return
        const lessonObject = await sequelize.models.lesson.findOne({
            raw: true,
            where: {
                id: lessonId
            }
        })
        console.log(lessonObject)
        if (lessonObject === null) {
            return res.status(404).json({error: "not found"});
        }
        return res.status(200).json({lesson: lessonObject});
    });
// GET ONE
// UPDATE ONE 
// DELETE ONE 


module.exports = router;