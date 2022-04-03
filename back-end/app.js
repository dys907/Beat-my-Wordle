const express = require("express");
const mysql = require("mysql");
const scheduler = require('./scheduling/scheduler');
const PORT = process.env.PORT || 8080;
const app = express();
// ---------------------- SWAGGER PAGE ------------------------------- 
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./documents/swagger.json');
const API_VERSION = require('./configs/API_VERSION');

//------------------------------------
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(function (req, res, next) {
    res.header( "Access-Control-Allow-Origin", "*");
    res.header( "Access-Control-Allow-Headers", "*");
    res.header( "Access-Control-Allow-Methods", "*");
    next();
});

//routers
const gamesRouter = require('./server/route/gamesRouter.js');
const wordsRouter = require('./server/route/wordsRouter.js');
const usersRouter = require('./server/route/usersRouter.js');
const scoresRouter = require('./server/route/scoresRouter.js');
//USE ROUTERS
app.use(API_VERSION + 'words', wordsRouter); //words
app.use(API_VERSION + "games", gamesRouter); //matchmaking
app.use(API_VERSION + 'users', usersRouter); //users
app.use(API_VERSION + 'scores', scoresRouter); //scores
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App listening on port ${PORT}`);
})

//node schedule resets words (daily) using cronjob scheduling at 12:00 EST
scheduler;
// ----------------- HELPER FUNCTIONS --------------------
