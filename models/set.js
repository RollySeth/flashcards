const mongoose = require("mongoose");
const Cards = require("./cards");

const setSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isPublic: { type: String, default: false },
  userId: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateAccessed: { type: Date },
  setAttempts: { type: Number, default: 0 },
  cardAttempts: { type: Number, default: 0 },
  cardScorrect: { type: Number, default: 0 },
});

module.exports = mongoose.model("set", setSchema);
