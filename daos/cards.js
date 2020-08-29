const mongoose = require("mongoose");
const Card = require("../models/cards");

module.exports = {};

module.exports.create = async (setId, sideA, sideB) => {
  try {
    const cards = await Card.create({
      setId: setId,
      sideA: sideA,
      sideB: sideB,
    });
    return cards;
  } catch (e) {
    throw e;
  }
};

module.exports.updateCardById = async (cardId, setId, sideA, sideB) => {
  const card = await Card.updateOne(
    {
      _id: cardId,
      setId: setId,
    },
    {
      sideA: sideA,
      sideB: sideB,
      cardsAttempts: 0,
      cardsCorrect: 0,
    }
  );
  if (card) {
    return card;
  } else {
    return false;
  }
};

module.exports.addAttempts = async (cardId, setId, num) => {
  // ifCorrect should be 0 if answer incorrect and 1 if correct
  const card = await Card.findOne({
    _id: cardId,
    setId: setId,
  });
  const number = num === "0" ? 0 : 1;
  cardsAttempts = card.cardsAttempts + 1;
  cardsCorrect = card.cardsCorrect + parseInt(number);
  if (card) {
    const updatedCard = await Card.updateOne(
      {
        _id: cardId,
        setId: setId,
      },
      {
        cardsAttempts: cardsAttempts,
        cardsCorrect: cardsCorrect,
      }
    );

    if (updatedCard) {
      return updatedCard;
    } else {
      return false;
    }
  }
};
module.exports.getCardsBySetId = async (setId) => {
  const card = Card.find({ setId: setId });
  if (card) {
    return card;
  } else {
    return false;
  }
};
module.exports.getById = async (cardId, setId) => {
  if (!setId) {
    return null;
  }
  return Card.findOne({ _id: cardId, setId: setId }).lean();
};

module.exports.deleteById = async (cardId) => {
  if (!cardId) {
    return null;
  }
  await Card.deleteOne({ _id: cardId });
  return true;
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
