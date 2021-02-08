const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sequelize = require('../../infrastructure/database');
const tokenValidator = require('../../middlewares/tokenValidator')
const headerFiller = require('../../middlewares/headerFiller')

router.post('/adminSetRank',
  [
    headerFiller,
    tokenValidator,
    [
    body('userId', 'userId is required')
      .notEmpty()
      .isInt(),
    body('roleId', 'rankId is required')
      .notEmpty()
      .isInt(),
    body('token', 'token is required')
      .notEmpty()
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors : errors.array()});
    }

    let userRoleId = req.user.role;

    if (userRoleId !== 7) {
      return res.status(403).json({msg : "You don't have permission to perform this action"})
    }

    const targetUserId = req.body.userId;

    const targetUser = await sequelize.models.user.findOne({
      raw: true,
      where: {
        id: targetUserId
      }
    })

    if (!targetUser) {
      res.status(404).json({msg: "User not found"})
    }

    const targetRoleId = req.body.roleId;

    const targetRole = await sequelize.models.role.findOne({
      raw: true,
      where: {
        id: targetRoleId
      }
    })

    if (!targetRole) {
      return res.status(404).json({msg: "Role not found"})
    }

    try {
      const updateActiveRole = await sequelize.models.user_has_role.update({
        isActive: false
      }, {
        where: {
          userId: targetUser.id,
          isActive: true
        }
      })

      const userHasRoleCreate = await sequelize.models.user_has_role.create({
        isActive: true,
        userId: targetUser.id,
        roleId: targetRole.id
      })

      return res.status(200).json({userId: targetUser.id, roleId: targetRole.id})
    } catch (e) {
      return res.status(500).json({ errors: [{ msg: 'Internal error' }] });
    }

})

router.get('/getAll',
  [
    headerFiller
  ],
  async (req, res) => {
    try {
      const roles = await sequelize.models.role.findAll();

      res.json({ roles })

    } catch (error) {
      res.status(500).json({ errors: [{ msg: 'Internal error' }] });
    }
  });

module.exports = router
