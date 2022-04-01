
const express = require("express");
const wordCheck = require('../controller/words/wordCheck');
const wordView = require('../controller/words/wordView');
const wordUpload = require('../controller/words/wordUpload');
const wordDelete = require('../controller/words/wordDelete');
const wordDeleteAll = require('../controller/words/wordDeleteAll');

const wordsRouter = express.Router();

wordsRouter.get("/",wordView);
wordsRouter.delete("/",wordDelete);
wordsRouter.get("/check",wordCheck);
wordsRouter.put("/upload", wordUpload);
wordsRouter.delete("/all",wordDeleteAll);


module.exports = wordsRouter;