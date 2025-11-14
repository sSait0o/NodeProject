const { body } = require("express-validator");

exports.registerValidator = [
  body("username").notEmpty().withMessage("username requis"),
  body("password").isLength({ min: 3 }).withMessage("password trop court"),
  body("role").optional().isIn(["user", "admin"]),
];
