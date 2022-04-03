const authenticateToken = require("../../helper/authenticateToken");
const scoreChange = require("../controller/scores/scoreChange");
const scoreGet = require("../controller/scores/scoreGet");
const scoreGetAll = require("../controller/scores/scoreGetAll");
const express = require("express");

const scoresRouter = express.Router();

scoresRouter.post("/", authenticateToken, scoreChange);
scoresRouter.get("/", authenticateToken, scoreGet);
scoresRouter.get("/all", authenticateToken, scoreGetAll);

module.exports = scoresRouter;