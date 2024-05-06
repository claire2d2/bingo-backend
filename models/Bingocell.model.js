const { Schema, model } = require("mongoose");

// Model for the cells that will make up a player's game
const bingocellSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
    anecdote: {
      type: Schema.Types.ObjectId,
      ref: "Anecdote",
    },
    proposition: {
      type: String,
      default: "",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Bingocell = model("Bingocell", bingocellSchema);

module.exports = Bingocell;
