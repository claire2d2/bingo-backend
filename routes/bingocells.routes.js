const router = require("express").Router();
const Bingocell = require("../models/Bingocell.model");

//! all routes here are prefixed with /api/bingocells

// get all the bingocells for a given player (determine through front end if player needs to "log in" again or not)
router.get("/all/:playerId", async (req, res, next) => {
  try {
    const playerId = req.params.playerId;
    const bingoCells = await Bingocell.find({ player: playerId });
    res.status(200).json(bingoCells);
  } catch (error) {
    next(error);
  }
});

// update a given cell

router.put("/update/:cellId", async (req, res, next) => {
  try {
    const cellId = req.params.cellId;
    const { proposition } = req.body;
    const playerInput = { proposition };
    const updatedBingoCell = await Bingocell.findOneAndUpdate(
      { _id: cellId },
      playerInput,
      { new: true }
    );
    res.status(200).json(updatedBingoCell);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
