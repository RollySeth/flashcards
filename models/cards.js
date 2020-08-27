const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  sideA: { type: String, required: true },
  sideB: { type: String, required: true },
  cardsAttempts: { type: Number, default: 0 },
  cardsCorrect: { type: Number, default: 0 },
  setId: { type: String, required: true, index: true },
});

module.exports = mongoose.model("cards", cardSchema);
