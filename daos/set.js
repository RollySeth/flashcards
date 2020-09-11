const mongoose = require("mongoose");
const Set = require("../models/set");
const user = require("../models/user");

module.exports = {};

module.exports.create = async (title, description, category, userId) => {
  try {
    const set = await Set.create({
      title: title,
      description: description,
      category: category,
      userId: userId,
    });
    return set;
  } catch (e) {
    throw e;
  }
};

module.exports.updateSetById = async (setId, title, description, category) => {
  const set = await Set.updateOne(
    {
      _id: setId,
    },
    {
      $set: {
        title: title,
        description: description,
        category: category,
        dateUpdated: new Date(),
      },
    }
  );
  if (set) {
    return await Set.findOne({ _id: setId }).lean();
  } else {
    return false;
  }
};

module.exports.makePublic = async (setId, userId, isPublic) => {
  const set = await Set.updateOne(
    {
      _id: setId,
    },
    {
      isPublic: isPublic,
    }
  );
  if (set) {
    return set;
  } else {
    return false;
  }
};

module.exports.getById = async (setId) => {
  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return null;
  }
  return Set.findOne({ _id: setId }).lean();
};
module.exports.getPublic = async (number, userId) => {
  const set = Set.find({ isPublic: true, userId: { $ne: userId } })
    .limit(number)
    .sort({ dateUpdated: -1 });
  if (set) {
    return set;
  } else {
    return false;
  }
};

module.exports.getSetsByUserId = async (userId) => {
  const set = Set.find({ userId: userId }).sort({
    dateUpdated: -1,
  });
  if (set) {
    return set;
  } else {
    return false;
  }
};
module.exports.startById = async (setId, attempts) => {
  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return null;
  } else {
    const set = await Set.updateOne(
      {
        _id: setId,
      },
      {
        setAttempts: attempts + 1,
        lastDateAccessed: new Date(),
      }
    );
    if (set) {
      return set;
    } else {
      return false;
    }
  }
};

module.exports.deleteById = async (setId) => {
  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return false;
  }
  await Set.deleteOne({ _id: setId });
  return true;
};

module.exports.addAttempts = async (setId, num) => {
  const set = await Set.findOne({ _id: setId }).lean();

  const number = num === "0" ? 0 : 1;
  cardAttempts = set.cardAttempts + 1;
  cardsCorrect = set.cardsCorrect + parseInt(number);
  if (set) {
    const updatedSet = await Set.updateOne(
      {
        _id: setId,
      },
      {
        cardAttempts: cardAttempts,
        cardsCorrect: cardsCorrect,
      }
    );

    if (updatedSet) {
      return updatedSet;
    } else {
      return false;
    }
  }
};
module.exports.categoryStats = async () => {
  const set = await Set.aggregate([
    { $match: { isPublic: true, cardAttempts: { $ne: 0 } } },
    {
      $group: {
        _id: "$category",
        answered: { $sum: "$cardAttempts" },
        correct: { $sum: "$cardsCorrect" },
        setAttempts: { $sum: "$setAttempts" },
        sets: { $sum: 1 },
      },
    },
    { $set: { pctCorrect: { $divide: ["$correct", "$answered"] } } },
    { $sort: { pctCorrect: 1 } },
  ]);

  if (set) {
    return set;
  } else {
    return false;
  }
};
module.exports.setSearch = async (s, userId) => {
  const set = await Set.aggregate([
    { $match: { $text: { $search: s } } },
    { $set: { score: { $meta: "textScore" } } },
    { $sort: { score: { $meta: "textScore" } } },
    { $match: { $or: [{ isPublic: true }, { userId: userId }] } },
  ]);

  if (set) {
    return set;
  } else {
    return false;
  }
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
