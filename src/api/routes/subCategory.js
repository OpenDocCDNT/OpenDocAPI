const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sequelize = require('../../infrastructure/database');
const tokenValidator = require('../../middlewares/tokenValidator')
const headerFiller = require('../../middlewares/headerFiller')

router.post('/getAvailableSubCategories',
  [
    tokenValidator,
    headerFiller
    [
      body('token', 'Token is required')
        .notEmpty(),
      body('subcategoryId', 'SubCategory is required')
        .notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors : errors.array()});
    }

    const userRole = req.user.role;

    const availableSubCategories = await sequelize.models.role_see_sub.findAll({
      raw: true,
      where: {
        roleId: userRole
      }
    })
    if (!availableSubCategories) {
      return res.status(500).send({msg : "Internal Error"})
    }

    let subCategoriesReturnToReturn = []
    for (let i = 0;i < subCategoriesReturnToReturn.length; i++) {
      const subCategoryObject = await sequelize.models.subcategory.findOne({
        raw: true,
        where: {
          id: subCategoriesReturnToReturn[i].subcategoryId
        }
      })
      if (!subCategoryObject) {
        console.log("Unknown SubCategory")
      } else {
        subCategoriesReturnToReturn.push(subCategoryObject);
      }
    }

    return res.status(200).send({categories: subCategoriesReturnToReturn})
  })

router.get('/getAll',
  [
    headerFiller
  ],
  async (req, res) => {
    try {
      const subcategory = await sequelize.models.subcategory.findAll();

      res.json({ subcategory })

    } catch (error) {
      res.status(500).json({ errors: [{ msg: 'Internal error' }] });
    }
  });

module.exports = router
