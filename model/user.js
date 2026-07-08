const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
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
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.addToLibrary = function (gameId) {
  const exists = this.library.find(
    (item) => item.gameId.toString() === gameId.toString()
  );

  if (exists) {
    return Promise.resolve(this);
  }

  this.library.push({ gameId });

  return this.save();
};

UserSchema.methods.removeFromLibrary = function (gameId) {
  this.library = this.library.filter(
    (item) => item.gameId.toString() !== gameId.toString()
  );

  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
