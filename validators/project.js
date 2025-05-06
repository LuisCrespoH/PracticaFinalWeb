const { check } = require('express-validator');

const validateProject = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('projectCode').notEmpty().withMessage('El identificador del proyecto es obligatorio'),
  check('email').isEmail().withMessage('Email no válido'),
  check('address.street').notEmpty(),
  check('address.number').isNumeric(),
  check('address.postal').isNumeric(),
  check('address.city').notEmpty(),
  check('address.province').notEmpty(),
  check('code').notEmpty(),
  check('clientId').isMongoId().withMessage('clientId inválido')
];

module.exports = validateProject;