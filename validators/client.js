const { check } = require('express-validator');

const crearClienteValidator = [
  check('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  check('cif')
    .notEmpty()
    .withMessage('El CIF es obligatorio'),
  check('address.street')
    .notEmpty()
    .withMessage('La calle es obligatoria'),
  check('address.number')
    .isNumeric()
    .withMessage('El número debe ser numérico'),
  check('address.postal')
    .isNumeric()
    .withMessage('El código postal debe ser numérico'),
  check('address.city')
    .notEmpty()
    .withMessage('La ciudad es obligatoria'),
  check('address.province')
    .notEmpty()
    .withMessage('La provincia es obligatoria')
];

module.exports = { crearClienteValidator };