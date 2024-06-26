const { Schema, model } = require("mongoose");

// Model for the player
const playerSchema = new Schema(
  {
    // links to a created game
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    username: {
      type: String,
    },
    pinCode: {
      type: String,
      minLength: 4,
      maxLength: 4,
    },
    anecdotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bingocell",
      },
    ],
    // set to "true" when player has submitted his propositions
    submitted: {
      type: Boolean,
      default: "false",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Player = model("Player", playerSchema);

module.exports = Player;
