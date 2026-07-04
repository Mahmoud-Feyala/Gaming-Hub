const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  badge: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  trailerUrl: String,
  tags: String,
  description: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Game", GameSchema);