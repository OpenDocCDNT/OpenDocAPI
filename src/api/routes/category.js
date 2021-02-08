const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sequelize = require('../../infrastructure/database');
const tokenValidator = require('../../middlewares/tokenValidator')
const headerFiller = require('../../middlewares/headerFiller')

router.post('/getAvailableCategories',
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
    if (!errors.isEmpty()) {
      return res.status(400).json({errors : errors.array()});
    }

    const userRole = req.user.role;

    const availableCategories = await sequelize.models.role_see_category.findAll({
      raw: true,
      where: {
        roleId: userRole
      }
    })
    if (!availableCategories) {
      return res.status(500).send({msg : "Internal Error"})
    }

    let categoriesReturnToReturn = []
    for (let i = 0;i < availableCategories.length; i++) {
      const categoryObject = await sequelize.models.category.findOne({
        raw: true,
        where: {
          id: availableCategories[i].categoryId
        }
      })
      if (!categoryObject) {
        console.log("Unknown Category")
      } else {
        categoriesReturnToReturn.push(categoryObject);
      }
    }

    return res.status(200).send({categories: categoriesReturnToReturn})
  })

router.get('/getAll',
  [
    headerFiller
  ],
  async (req, res) => {
    try {
      const category = await sequelize.models.category.findAll();

      res.json({ category })

    } catch (error) {
      res.status(500).json({ errors: [{ msg: 'Internal error' }] });
    }
  });

module.exports = router
