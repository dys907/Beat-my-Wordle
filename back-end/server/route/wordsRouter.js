const authenticateToken = require("../../helper/authenticateToken");
const express = require("express");
const wordCheck = require('../controller/words/wordCheck');
const wordView = require('../controller/words/wordView');
const wordUpload = require('../controller/words/wordUpload');
const wordUpdate = require('../controller/words/wordUpdate')
const wordDelete = require('../controller/words/wordDelete');

const wordsRouter = express.Router();

wordsRouter.get("/",authenticateToken,wordView);
wordsRouter.delete("/",authenticateToken,wordDelete);
wordsRouter.get("/check",authenticateToken,wordCheck);
wordsRouter.put("/upload", authenticateToken ,wordUpload);
wordsRouter.put("/update", authenticateToken ,wordUpdate);


module.exports = wordsRouter;