const router = require("express").Router();
const Anecdote = require("../models/Anecdote.model");
// const isAuthenticated = require("../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/anecdotes

// router.use(isAuthenticated);

router.get("/:gameId", async (req, res, next) => {
  try {
    const id = req.params.gameId;
    const allAnecdotes = await Anecdote.find({ game: id });
    res.status(200).json(allAnecdotes);
  } catch (error) {
    next(error);
  }
});

// create a new game for a logged in user
router.post("/", async (req, res, next) => {
  try {
    const { game, title } = req.body;
    const createdAnecdote = await Anecdote.create({
      game: game,
      title: title,
    });
    res.status(201).json(createdAnecdote);
  } catch (error) {
    next(error);
  }
});

// modify game state to change whether the game is launched or not
router.put("/:gameId", async (req, res, next) => {
  try {
    const id = req.params.gameId;
    const { launched } = req.body;
    const isGameLaunched = { launched };
    const updateGameStatus = await Game.findOneAndUpdate(
      { _id: id },
      isGameLaunched,
      { new: true }
    );
    res.status(200).json(updateGameStatus);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
