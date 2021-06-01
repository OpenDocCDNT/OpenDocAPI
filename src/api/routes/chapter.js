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
const headerFiller = require('../../middlewares/headerFiller');
const tokenValidator = require('../../middlewares/tokenValidator');

router.post('/chapter',
    [
        headerFiller,
        tokenValidator,
        [
            body('token', 'Token is required')
            .notEmpty()
        ]
    ],
    async (req, res) => {

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

            const {
                id,
                displayName,
                email,
                serverCode
            } = user;

            const payload = {
                user: {
                    id,
                    displayName,
                    email,
                    serverCode,
                    role
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

router.post('/createChapter',
  [
      headerFiller,
      tokenValidator,
      [
          body('token', 'Token is required')
            .notEmpty(),
          body('lessonId','Lesson ID is required')
            .notEmpty()
            .isInt(),
          body('label', 'Label is required')
            .notEmpty(),
          body('order', 'Order is required')
            .notEmpty()
            .isInt(),
      ]
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
          return res.status(400).json({
              errors: errors.errors[0].msg
          });

      const {lessonId, label, order} = req.body

      if (!lessonId || !label || !order) return res.status(400).json({error: "value missing"});

      const lesson = await sequelize.models.lesson.findOne({
          raw: true,
          where: {
              id: lessonId
          }
      })

      if (!lesson) return res.status(404).json({error: "lesson not found"});

      const checkifOrderIsTaken = await sequelize.models.chapter.findAll({
          raw: true,
          where: {
              lessonId: lessonId,
              order: order
          }
      })

      const checkifOrderIsNotOutOfBound = await sequelize.models.chapter.findAll({
          raw: true,
          where: {
              lessonId: lessonId
          }
      })

      if (checkifOrderIsTaken.length > 0) return res.status(400).json({error: 'order already taken'})
      if (order > (checkifOrderIsNotOutOfBound.length + 1)) return res.status(400).json({error: 'order out of bound'})

      const transaction = await sequelize.transaction();

      try {
          const chapter = await sequelize.models.chapter.create({
              label: label,
              order: order,
              lessonId: lessonId
          }, {
              transaction
          });

          transaction.commit();

          return res.status(200).json({responses: "success"})
      } catch (e) {
          transaction.rollback()
          return res.status(500).json({
              errors: [{
                  msg: 'Internal error'
              }]
          })
      }
  })

router.post('/getChapterFromLesson',
  [
    headerFiller,
    tokenValidator,
      [
        body('token', 'Token is required')
          .notEmpty(),
        body('lessonId','Lesson ID is required')
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

      const {lessonId} = req.body

      if (!lessonId) return res.status(404).json({error: "not found"});

      const lesson = await sequelize.models.lesson.findOne({
          raw: true,
          where: {
              id: lessonId
          }
      })

      if (!lesson) return res.status(404).json({error: "not found"});

      const chapters = await sequelize.models.chapter.findAll({
          raw: true,
          where: {
              lessonId: lessonId
          }
      })
      console.log(chapters)

      if (chapters)
      return res.status(200).json({chapters})
  })

router.post('/chapter/:chapterId',
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
            }),
            body('serverCode', 'Enter a server code')
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

module.exports = router;