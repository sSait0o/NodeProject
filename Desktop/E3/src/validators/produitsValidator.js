const { body } = require("express-validator");

exports.createProduitValidator = [
  body("nom").notEmpty().withMessage("Le nom est requis"),
  body("code").notEmpty().withMessage("Le code est requis"),
  body("quantite").isInt({ min: 0 }).withMessage("quantite doit être >= 0"),
  body("depot_id").notEmpty().withMessage("depot_id est requis"),
];
