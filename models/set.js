const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  userId: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date },
  lastDateAccessed: { type: Date },
  setAttempts: { type: Number, default: 0 },
  cardAttempts: { type: Number, default: 0 },
  cardsCorrect: { type: Number, default: 0 },
  cards: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "cards" }] },
});
setSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("set", setSchema);
