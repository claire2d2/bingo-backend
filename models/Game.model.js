const { Schema, model } = require("mongoose");

// Model for a game
const gameSchema = new Schema(
  {
    name: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    grid: {
      type: Number,
      min: 3,
      max: 5,
    },
    launched: {
      type: Boolean,
      default: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
