const router = require("express").Router();
const Player = require("../models/Player.model");
const Anecdote = require("../models/Anecdote.model");
const Bingocell = require("../models/Bingocell.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/players

// find a game is user has already "created" account
// create a new game for a "logged in" user
router.get("/login/:gameId", async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    const username = req.query.username;
    const pinCode = req.query.pinCode;
    const foundPlayer = await Player.findOne({
      username: username,
      game: gameId,
    }).populate("anecdotes");
    if (foundPlayer) {
      if (pinCode !== foundPlayer.pinCode) {
        res.status(400).json({ message: "mauvais code pin" });
      }
      res.status(200).json(foundPlayer);
    } else {
      res.status(400).json({ message: "pas de joueur existant" });
    }
  } catch (error) {
    next(error);
  }
});

// get player data for existing
router.get("/fetchPlayer", async (req, res, next) => {
  try {
    const gameId = req.query.game;
    const username = req.query.username;
    const foundPlayer = await Player.findOne({
      username: username,
      game: gameId,
    }).populate("anecdotes");
    res.status(200).json(foundPlayer);
  } catch (error) {
    next(error);
  }
});

// create a new game
router.post("/:gameId", async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    const { username, pinCode } = req.body;
    const foundPlayer = await Player.findOne({
      username: username,
      game: gameId,
    });
    if (foundPlayer) {
      res.status(400).json({ message: "ce nom est déjà utilisé" });
    }
    const alreadyFoundAnecdotes = [];
    const createdPlayer = await Player.create({
      game: gameId,
      username: username,
      pinCode: pinCode,
    });
    // find all the anecdotes linked to the current game
    const foundAnecdotes = await Anecdote.find({ game: gameId });
    // ensure we don't have more anecdotes to find than available
    const anecdotesToFind = Math.min(25, foundAnecdotes.length);
    for (let i = 0; i < anecdotesToFind; i++) {
      findRandomAnecdote(foundAnecdotes, alreadyFoundAnecdotes);
    }

    const bingoCellsArray = alreadyFoundAnecdotes.map(async (anecdote) => {
      return await Bingocell.create({
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
  } catch (error) {
    next(error);
  }
});

function findRandomAnecdote(anecdotesArray, alreadyFoundAnecdotes) {
  if (alreadyFoundAnecdotes.length >= anecdotesArray.length) {
    return;
  }

  let randomAnecdote;
  do {
    const randomIndex = Math.floor(Math.random() * anecdotesArray.length);
    randomAnecdote = anecdotesArray[randomIndex];
  } while (alreadyFoundAnecdotes.includes(randomAnecdote));

  alreadyFoundAnecdotes.push(randomAnecdote);
}
module.exports = router;
