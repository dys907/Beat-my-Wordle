const authenticateToken = require("../../helper/authenticateToken");
const login = require("../controller/users/login");
const signup = require("../controller/users/signup");
const adminLogin = require("../controller/users/adminLogin");
const gameStatus = require("../controller/users/gameStatus");
const logout = require("../controller/users/logout");
const express = require("express");

const usersRouter = express.Router();

usersRouter.post("/login", login);
usersRouter.post("/signup", signup);
usersRouter.post("/adminLogin",  adminLogin);
usersRouter.get("/gamestatus", authenticateToken, gameStatus);
usersRouter.post("/logout", authenticateToken, logout);

module.exports = usersRouter;