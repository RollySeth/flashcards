const mongoose = require("mongoose");
const Set = require("../models/set");

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
  const item = await Set.updateOne({
    _id: setId,
    title: title,
    description: description,
    category: category,
  });
  if (item) {
    return item;
  } else {
    return false;
  }
};

module.exports.getById = (setId) => {
  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return null;
  }
  return Set.findOne({ _id: setId }).lean();
};

module.exports.deleteById = async (setId) => {
  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return false;
  }
  await Set.deleteOne({ _id: setId });
  return true;
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
