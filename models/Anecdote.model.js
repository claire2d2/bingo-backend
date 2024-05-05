const { Schema, model } = require("mongoose");

// Model for the anecdotes that the game master submits (minimum of 25 will be set with the front end)
const anecdoteSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    title: {
      type: String,
      maxLength: 50,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Anecdote = model("Anecdote", anecdoteSchema);

module.exports = Anecdote;
