const express = require("express");
const router = express.Router({ mergeParams: true });
const ctrl = require("../controllers/zonesController");

router.get("/", ctrl.get);
router.post("/", ctrl.create);
router.put("/", ctrl.update);

module.exports = router;
