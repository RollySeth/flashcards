const mongoose = require("mongoose");
const History = require("../models/history");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {};

module.exports.create = async (userId) => {
  try {
    const history = await History.create({
      userId: userId,
    });
    return history;
  } catch (e) {
    throw e;
  }
};

module.exports.getByUserId = async (userId) => {
  try {
    const user = await History.findOne({ userId: userId });
    return user;
  } catch (e) {
    throw e;
  }
};
module.exports.startSet = async (setId, category, userId) => {
  try {
    await History.findOne({ userId: userId }).then((doc) => {
      const setsAttempted = doc.setsAttempted;
      const index = setsAttempted.findIndex((s) => s.setId == setId);
      if (index === -1 || history.setsAttempted.length === 0) {
        const set = {
          setId: setId,
          category: category,
          cardsAttempted: 0,
          cardsCorrect: 0,
          setAttempts: 1,
        };
        History.updateOne(
          { userId: userId },
          {
            $push: {
              setsAttempted: set,
            },
          }
        );
      }
    });
  } catch (e) {
    throw e;
  }
};
class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
