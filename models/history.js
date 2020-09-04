const mongoose = require("mongoose");

const setAttempts = new mongoose.Schema({
  setId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "set",
    required: true,
  },
  category: { type: String },
  cardsAttempted: { type: Number },
  cardsCorrect: { type: Number },
  setAttempts: { type: Number },
});
const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  setsAttempted: { type: [{ setAttempts }] },
});
module.exports = mongoose.model("history", historySchema);
