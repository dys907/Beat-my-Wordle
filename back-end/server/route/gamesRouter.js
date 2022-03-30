const getGame = require("../controller/games/getGame");
const gameExist = require("../controller/games/gameExist");
const createGame = require("../controller/games/createGame");
const updateGameStatus = require("../controller/games/updateGameStatus");
const matchDeleteAll = require("../controller/games/matchDeleteAll");
const express = require("express");

const gamesRouter = express.Router();

gamesRouter.get("/",getGame);
gamesRouter.get("/exist",gameExist);
gamesRouter.post("/",createGame);
gamesRouter.patch("/",updateGameStatus);
gamesRouter.delete("/all",matchDeleteAll);

module.exports = gamesRouter;