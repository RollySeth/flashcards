const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  setsAttempted: {
    type: [
      {
        setId: {
          type: String,
          required: true,
        },
        category: { type: String },
        cardsAttempted: { type: Number, default: 0 },
        cardsCorrect: { type: Number, default: 0 },
        attempted: { type: Number, default: 1 },
        lastAttempted: { type: Date, default: Date.now },
      },
    ],
  },
});
module.exports = mongoose.model("history", historySchema);
