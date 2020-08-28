const { Router } = require("express");
const router = Router();
const express = require("express");

router.use("/flashcards", express.static("build"));
router.use("/login", require("./login"));
router.use("/set", require("./set"));
router.use("/cards", require("./cards"));

module.exports = router;
