const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes.js"));
router.use("/games", require("./games.routes.js"));
router.use("/anecdotes", require("./anecdotes.routes.js"));
router.use("/players", require("./players.routes.js"));
router.use("/bingocells", require("./bingocells.routes.js"));

module.exports = router;
