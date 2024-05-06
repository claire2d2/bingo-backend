const router = require("express").Router();
const Game = require("./../models/Game.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/games

router.get("/", async (req, res, next) => {
  try {
    const allGames = await Game.find({});
    res.status(200).json(allGames);
  } catch (error) {
    next(error);
  }
});

router.use(isAuthenticated);

// create a new game for a logged in user
router.post("/", async (req, res, next) => {
  try {
    const creator = req.currentUserId;
    const createdGame = await Game.create({
      creator: creator,
    });
    res.status(201).json(createdGame);
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
