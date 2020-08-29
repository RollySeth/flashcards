const { Router } = require("express");
const router = Router();
const express = require("express");
const path = require("path");

// const SignUpRouter=require("./src/SignUp.js")
//  router.use(express.static(path.join(__dirname,"public")));
router.use("/flashcards", express.static("build"));
router.use("/login", require("./login"));
router.use("/set", require("./set"));
router.use("/cards", require("./cards"));
<<<<<<< HEAD
// router.use("/login", SignUpRouter);

=======
>>>>>>> f61ffe3bb5d0b437145317e22fae61739932f02b
module.exports = router;
