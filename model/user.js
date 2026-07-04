const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  library: [
    {
      gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
        required: true,
      },

      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

UserSchema.methods.addToLibrary = function (gameId) {
  const exists = this.library.find((item) => {
    return item.gameId.toString() === gameId.toString();
  });

  if (exists) {
    return Promise.resolve(this);
  }

  this.library.push({ gameId });

  return this.save();
};

UserSchema.methods.removeFromLibrary = function (gameId) {
  this.library = this.library.filter((item) => {
    return item.gameId.toString() !== gameId.toString();
  });

  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
