const { Router } = require("express");
const router = Router();
const cardsDAO = require("../daos/cards");
const { JWTSECRET } = process.env;
const secret = JWTSECRET;
const jwt = require("jsonwebtoken");
const setDAO = require("../daos/set");
const historyDAO = require("../daos/history");

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
        res.locals.user = tokenNew;
        next();
      }
    });
  }
  return;
};

const adminCheck = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// Post Cards
//Need to read authorization
router.post("/:cardsetId", async (req, res, next) => {
  const cardsetId = req.params.cardsetId;

  const set = await setDAO.getById(req.params.cardsetId);

  if (!set) {
    res.sendStatus(404);
  } else if (set) {
    //if (
    //  set.userId === res.locals.user._id ||
    //  res.locals.user.roles.includes("admin")
    //)
    const { sideA, sideB } = req.body;
    const card = await cardsDAO.create(cardsetId, sideA, sideB);
    if (card) {
      res.json(card);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// Update attempts/correct attempts
router.put(
  "/answers/:cardsetId/:id/:num",
  authorizationCheck,
  async (req, res, next) => {
    const card = await cardsDAO.addAttempts(
      req.params.id,
      req.params.cardsetId,
      req.params.num
    );
    const set = await setDAO.addAttempts(req.params.cardsetId, req.params.num);
    if (set) {
      const history = historyDAO.cardCount(
        req.params.cardsetId,
        res.locals.user._id,
        req.params.num
      );
      res.json(history);
    } else {
      res.sendStatus(401);
    }
  }
);

// get cards in cardset
router.get("/:cardsetId/", authorizationCheck, async (req, res, next) => {
  const cardsetId = req.params.cardsetId;
  const set = await setDAO.getById(req.params.cardsetId);

  if (!set) {
    res.sendStatus(404);
  } else if (
    set.userId === res.locals.user._id ||
    res.locals.user.roles.includes("admin") ||
    set.isPublic === true
  ) {
    const cards = await cardsDAO.getCardsBySetId(cardsetId);
    if (cards) {
      res.json(cards);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// Update metadata of id
router.put("/:cardsetId/:id", authorizationCheck, async (req, res, next) => {
  const cardsetId = req.params.cardsetId;
  const set = await setDAO.getById(cardsetId);

  if (!set) {
    res.sendStatus(404);
  } else if (
    set.userId === res.locals.user._id ||
    res.locals.user.roles.includes("admin")
  ) {
    const { sideA, sideB } = req.body;
    const card = await cardsDAO.updateCardById(
      req.params.id,
      req.params.cardsetId,
      sideA,
      sideB
    );
    if (card) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// GET single id
router.get("/:cardsetId/:id", authorizationCheck, async (req, res, next) => {
  const cardsetId = req.params.cardsetId;
  const set = await setDAO.getById(cardsetId);

  if (!set) {
    res.sendStatus(404);
  } else if (
    set.userId === res.locals.user._id ||
    res.locals.user.roles.includes("admin") ||
    set.isPublic === true
  ) {
    const card = await cardsDAO.getById(req.params.id, req.params.cardsetId);
    if (card) {
      res.json(card);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401);
  }
});

// Delete
router.delete(
  "/delete/:cardsetId/:id",
  authorizationCheck,
  async (req, res, next) => {
    const cardsetId = req.params.cardsetId;
    const set = await setDAO.getById(cardsetId);

    if (!set) {
      res.status(404).send("set not found");
    } else if (
      set.userId === res.locals.user._id ||
      res.locals.user.roles.includes("admin")
    ) {
      const cardId = req.params.id;
      try {
        const success = await cardsDAO.deleteById(cardId);
        res.sendStatus(success ? 200 : 400);
      } catch (e) {
        res.status(500).send(e.message);
      }
    } else {
      res.sendStatus(401);
    }
  }
);
module.exports = router;
