const authenticateToken = require("../../helper/authenticateToken");
const getGame = require("../controller/games/getGame");

const createGame = require("../controller/games/createGame");
const updateGameStatus = require("../controller/games/updateGameStatus");
const express = require("express");

const gamesRouter = express.Router();

gamesRouter.get("/",authenticateToken,getGame);
gamesRouter.post("/",authenticateToken,createGame);
gamesRouter.patch("/",authenticateToken,updateGameStatus);

module.exports = gamesRouter;