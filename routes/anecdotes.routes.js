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

// update anecdote content
router.put("/one/:anecdoteId", async (req, res, next) => {
  try {
    const id = req.params.anecdoteId;
    const { title } = req.body;
    const newTitle = { title };
    const updatedAnecdote = await Anecdote.findOneAndUpdate(
      { _id: id },
      newTitle,
      { new: true }
    );
    res.status(200).json(updatedAnecdote);
  } catch (error) {
    next(error);
  }
});

// delete an anecdote

router.delete("/one/:anecdoteId", async (req, res, next) => {
  try {
    const id = req.params.anecdoteId;
    await Anecdote.findOneAndDelete({ _id: id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
