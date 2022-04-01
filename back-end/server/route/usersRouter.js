const login = require("../controller/users/login");
const signup = require("../controller/users/signup");
const adminLogin = require("../controller/users/adminLogin");
const gameStatus = require("../controller/users/gameStatus");
const express = require("express");

const usersRouter = express.Router();

usersRouter.post("/login", login);
usersRouter.post("/signup", signup);
usersRouter.post("/adminLogin", adminLogin);
usersRouter.get("/gamestatus", gameStatus);

module.exports = usersRouter;