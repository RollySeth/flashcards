const { Router } = require("express");
const router = Router();
const historyDAO = require("../daos/history");
const { JWTSECRET } = process.env;
const secret = JWTSECRET;
const jwt = require("jsonwebtoken");
const authorizationCheck = async (req, res, next) => {
  let header = req.headers.authorization;
  if (!header) {
    res.sendStatus(401);
  } else {
    const token = header.split(" ")[1];
    const userCheck = jwt.verify(token, secret, (e, tokenNew) => {
      if (e) {
        res.sendStatus(401);
      } else {
        // console.log(tokenNew);
        res.locals.user = tokenNew;
        next();
      }
    });
  }
  return;
};

// GET user history
router.get("/", authorizationCheck, async (req, res, next) => {
  const userId = res.locals.user._id;
  const history = await historyDAO.getByUserId(userId);
  if (!history) {
    res.sendStatus(401);
  } else {
    res.json(history);
  }
});

// GET user history of specific cardset
router.get("/single/:cardsetId", authorizationCheck, async (req, res, next) => {
  const userId = res.locals.user._id;
  const cardset = req.params.cardsetId;
  const history = await historyDAO.getByCardset(userId, cardset);
  if (!history) {
    res.sendStatus(401);
  } else {
    res.json(history);
  }
});

// reset user history
router.put("/reset", authorizationCheck, async (req, res, next) => {
  const userId = res.locals.user._id;
  const history = await historyDAO.resetUserHistory(userId);
  if (!history) {
    res.sendStatus(401);
  } else {
    res.json(history);
  }
});

module.exports = router;
