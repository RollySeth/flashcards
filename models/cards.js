const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  setId: { type: String, required: true },
  sideA: { type: String, required: true },
  sideB: { type: String, required: true },
  cardsAttempts: { type: Number, default: 0 },
  cardsCorrect: { type: Number, default: 0 },
});

module.exports = mongoose.model("card", cardSchema);
