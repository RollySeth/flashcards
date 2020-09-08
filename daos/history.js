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

// Get a user's id if you are the user
module.exports.getByUserId = async (userId) => {
  try {
    const history = await History.findOne({ userId: userId });
    return history;
  } catch (e) {
    throw e;
  }
};

// Get a user's id if you are the user
module.exports.getByCardset = async (userId, cardset) => {
  try {
    const history = await History.findOne(
      {
        userId: userId,
      },
      { setsAttempted: { $elemMatch: { setId: cardset } } }
    );
    return history.setsAttempted[0];
  } catch (e) {
    throw e;
  }
};

// Log the start of a set
module.exports.startSet = async (setId, category, userId) => {
  try {
    await History.findOne({ userId: userId }).then((doc) => {
      const setsAttempted = doc.setsAttempted;
      const index = setsAttempted.findIndex((s) => s.setId == setId);
      if (index === -1 || setsAttempted.length === 0) {
        const set = {
          setId: setId,
          category: category,
          cardsAttempted: 0,
          cardsCorrect: 0,
          attempted: 1,
          lastAttempted: new Date(),
        };
        doc.setsAttempted.push(set);
        doc.save();
        return doc;
      } else {
        let set = doc.setsAttempted[index];
        set.attempted++;
        doc.save();
        return doc;
      }
    });
  } catch (e) {
    throw e;
  }
};

module.exports.cardCount = async (setId, userId, correct) => {
  try {
    await History.findOne({ userId: userId }).then((doc) => {
      const setsAttempted = doc.setsAttempted;
      const index = setsAttempted.findIndex((s) => s.setId == setId);
      if (index === -1 || setsAttempted.length === 0) {
        return;
      } else {
        let set = doc.setsAttempted[index];
        set.cardsAttempted++;
        set.cardsCorrect = set.cardsCorrect + parseInt(correct);
        doc.save();
      }
      return doc;
    });
  } catch (e) {
    throw e;
  }
};

//Route created for development reasons
module.exports.resetUserHistory = async (userId) => {
  try {
    const user = await History.aggregate([
      { $unwind: { path: "$setsAttempted" } },
    ]);
    return user;
  } catch (e) {
    throw e;
  }
};

module.exports.userStats = async (userId) => {
  try {
    const user = await History.updateOne(
      { userId: userId },
      { setsAttempted: [] }
    );
    return user;
  } catch (e) {
    throw e;
  }
};
class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
