const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/mouvementsController");
const auth = require("../middleware/authMiddleware");

// GET /mouvements
router.get("/", ctrl.list);

// POST /mouvements
router.post("/", auth, ctrl.create);

module.exports = router;
