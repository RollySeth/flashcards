const { Router } = require("express");
const router = Router();
const cardsDAO = require("../daos/cards");
const secret = "shhhhhh do not tell anyone this secret.";
const jwt = require("jsonwebtoken");
const setDAO = require("../daos/set");

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
        req.user = tokenNew;
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

// Update attempts/correct attempts
router.put("/answers/:cardsetId/:id/:correct", async (req, res, next) => {
  const { correct } = req.params.correct;
  const card = await cardsDAO.addAttempts(
    req.params.id,
    req.params.cardsetId,
    correct
  );
  const set = await setDAO.addAttempts(req.params.cardsetId, correct);
  if (set) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

router.post("/:cardsetId", async (req, res, next) => {
  const cardsetId = req.params.cardsetId;
  const { sideA, sideB } = req.body;
  const card = await cardsDAO.create(cardsetId, sideA, sideB);
  if (card) {
    res.json(card);
  } else {
    res.sendStatus(401);
  }
});

// get cards in cardset
router.get("/:cardsetId/", async (req, res, next) => {
  const cardsetId = req.params.cardsetId;
  const cards = await cardsDAO.getCardsBySetId(cardsetId);
  if (cards) {
    res.json(cards);
  } else {
    res.sendStatus(401);
  }
});

// Update metadata of id
router.put("/:cardsetId/:id", async (req, res, next) => {
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
});

// GET single id
router.get("/:cardsetId/:id", async (req, res, next) => {
  const card = await cardsDAO.getById(req.params.id, req.params.cardsetId);
  if (card) {
    res.json(card);
  } else {
    res.sendStatus(404);
  }
});

// Delete
router.delete("/delete/:id", async (req, res, next) => {
  const cardId = req.params.id;
  try {
    const success = await cardsDAO.deleteById(cardId);
    res.sendStatus(success ? 200 : 400);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = router;
