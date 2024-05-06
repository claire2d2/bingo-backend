const router = require("express").Router();
const Player = require("../models/Player.model");
const Anecdote = require("../models/Anecdote.model");
const Bingocell = require("../models/Bingocell.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/players

// create a new game for a logged in user
router.post("/:gameId", async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    const { username, pinCode } = req.body;
    const alreadyFoundAnecdotes = [];

    const foundPlayer = await Player.findOne({ username: username }).populate(
      "anecdotes"
    );
    if (foundPlayer) {
      console.log(foundPlayer);
      if (pinCode !== foundPlayer.pinCode) {
        res.status(400).json({ message: "wrong pin code" });
      }
      res.status(200).json(foundPlayer);
    } else {
      const createdPlayer = await Player.create({
        game: gameId,
        username: username,
        pinCode: pinCode,
      });
      // find all the anecdotes linked to the current game
      const foundAnecdotes = await Anecdote.find({ game: gameId });
      for (let i = 0; i < 25; i++) {
        findRandomAnecdote(foundAnecdotes, alreadyFoundAnecdotes);
      }
      const bingoCellsArray = alreadyFoundAnecdotes.map(async (anecdote) => {
        await Bingocell.create({
          player: createdPlayer._id,
          anecdote: anecdote,
        });
      });
      await Promise.all(bingoCellsArray);
      const addBingoCells = await Bingocell.find({ player: createdPlayer._id });
      const addToPlayer = addBingoCells.map((cell) => cell._id);
      const completePlayer = await Player.findOneAndUpdate(
        { _id: createdPlayer._id },
        { anecdotes: addToPlayer },
        { new: true }
      ).populate("anecdotes");
      res.status(200).json(completePlayer);
    }
  } catch (error) {
    next(error);
  }
});

async function findRandomAnecdote(anecdotesArray, alreadyFoundAnecdotes) {
  const randomIndex = Math.floor(Math.random() * anecdotesArray.length);
  const randomAnecdote = anecdotesArray[randomIndex];
  if (alreadyFoundAnecdotes.includes(randomAnecdote)) {
    findRandomAnecdote(anecdotesArray, alreadyFoundAnecdotes);
  } else {
    alreadyFoundAnecdotes.push(randomAnecdote);
  }
}

module.exports = router;
