const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/produitsController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// GET /produits
router.get("/", ctrl.list);

// POST /produits
router.post("/", auth, ctrl.create);

// PUT /produits/:id
router.put("/:id", auth, ctrl.update);

// DELETE /produits/:id (admin uniquement)
router.delete("/:id", auth, isAdmin, ctrl.remove);

module.exports = router;
