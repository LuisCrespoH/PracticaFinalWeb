const { body } = require("express-validator");

const validarAlbaran = [
  body("clientId")
    .notEmpty().withMessage("El clientId es obligatorio")
    .isMongoId().withMessage("El clientId no es válido"),

  body("projectId")
    .notEmpty().withMessage("El projectId es obligatorio")
    .isMongoId().withMessage("El projectId no es válido"),

  body("format")
    .notEmpty().withMessage("El formato es obligatorio")
    .isIn(["material", "hours"]).withMessage("El formato debe ser 'material' o 'hours'"),

  body("workdate")
    .notEmpty().withMessage("La fecha de trabajo es obligatoria")
    .isDate({ format: "YYYY-MM-DD" }).withMessage("La fecha debe tener formato válido"),

  // Si el formato es 'material', el campo 'material' es obligatorio
  body("material")
    .if(body("format").equals("material"))
    .notEmpty().withMessage("El material es obligatorio para albaranes de tipo 'material'"),

  // Si el formato es 'hours', el campo 'hours' es obligatorio y debe ser numérico
  body("hours")
    .if(body("format").equals("hours"))
    .notEmpty().withMessage("Las horas son obligatorias para albaranes de tipo 'hours'")
    .isFloat({ min: 0 }).withMessage("Las horas deben ser un número mayor o igual a 0")
];

module.exports = validarAlbaran;