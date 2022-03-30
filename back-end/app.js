const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const url = require("url");
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// ---------------------- SWAGGER PAGE ------------------------------- 
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./documents/swagger.json');
const sc = require('./configs/httpResponseCodes'); //temporarily placed here
const TOKEN_STRING = crypto.randomBytes(64).toString('hex');
const API_VERSION = require('./configs/API_VERSION');


//TODO: initialize with fxn so verson and endpoint not repeated
let statReport = {
    "GET": {
        "/1/scores/all": 0, //used
        "/1/scores/id": 0, //used
        "/1/words/check": 0, //used
        "/1/games/id": 0, //used
        "/1/games/exist/id": 0, //used
        "/1/words": 0 // used
    },
    "POST": {
        "/1/scores" : 0, 
        "/1/users/signup": 0,
        "/1/users/login": 0,
        "/1/users/adminLogin": 0
    },
    "PUT": {
        "/1/words/upload": 0 //used
    },
    "DELETE": {
        "/1/words/all":0, //used
        "/1/words/id": 0, //used
        "1/games/all":0 //used
    },
    "PATCH": {
        "/1/games": 0 //used
    }
};
//-------------------------------------
const con = mysql.createConnection({
    host: "localhost",
    user: "root", //"/itsvicly_wordle_user",
    password: "", //"FHbEpZeEhiL8X3AG",
    database: "itsvicly_wordle"
})
//Establish DB connection ONCE
// con.connect(function(err) {
//     if (err) throw err;
// })

//------------------------------------
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(function (req, res, next) {
    res.header( "Access-Control-Allow-Origin", "*");
    res.header( "Access-Control-Allow-Headers", "*");
    res.header( "Access-Control-Allow-Methods", "*");
    next();
});

require('./routes/users.js')(app, API_VERSION, con, TOKEN_STRING, statReport);
//routers
const gamesRouter = require('./server/route/gamesRouter.js');
const wordsRouter = require('./server/route/wordsRouter.js');

//USE ROUTERS
app.use(API_VERSION + 'words',wordsRouter); //words
app.use(API_VERSION + "games",gamesRouter); //matchmaking


// ---------------------- SCORING ENDPOINT ---------------
//For getting a user's score
app.get(API_VERSION + 'scores', (req, res) => {
    statReport.GET[API_VERSION + "scores/id"] += 1;
    const username = url.parse(req.url, true).query["username"];
    let sql = "SELECT score FROM scores WHERE username = ?";
    con.query(sql, [username], function(err, result) {
        if (err) {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
        } else if (result.length === 1) {
            console.log(result);
            res.status(sc.OK).send(JSON.stringify(result));
        } else {
            console.log(result);
            res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    })
})

//For getting all user's scores
app.get(API_VERSION + 'scores/all', (req, res) => {
    statReport.GET[API_VERSION + "scores/all"] += 1;
    let sql = "SELECT username, score FROM scores ORDER BY score DESC";
    con.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
        } else {
            res.status(sc.OK).send(JSON.stringify(result));
        }
    })
})

con.promise = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) { reject(new Error()); }
            else { resolve(result); }
        });
    });
};

// For updating a user's score
app.post(API_VERSION + 'scores', (req, res) => {
    statReport.POST["/1/scores"] += 1;
    const body = req.body;
    const username = body.username;
    const scoreAddition = body.score;
    console.log(typeof(scoreAddition));
    if (isInteger(scoreAddition)) {
        let sql = "SELECT score FROM scores WHERE username='" + username + "'";
        con.promise(sql).then((result) => {
            console.log(result);
            let sql;
            if (result.length === 1) {
                const newScore = result[0].score + scoreAddition;
                sql = `UPDATE scores SET score =${newScore} WHERE username='${username}'`;
                console.log(sql);
                return con.promise(sql);
            } else {
                console.log("No user found");
                res.status(sc.FORBIDDEN).send("No users with that username");
            }
        }).then((result) => {
            console.log(result);
            res.status(sc.OK).send("Score updated successfully")
        }).catch((err) => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
        });
    } else {
        res.status(sc.FORBIDDEN).send("Invalid request - score increment must be an integer")
    }
    
})
// // Scoreboard
// // Retrieve top X users by score
// // leaderboardNumber
// app.get('scores/leaderboard', (req, res) => {
//     let userCount = 0;
//     let q = req.body;
//     let userCountSql = "SELECT COUNT(UserID) FROM users";
//     try {
//         con.query(sql, function (err, result) {
//             if (err) {
//                 throw err;
//             } else {
//                 console.log(result);
//                 userCount = result;
//             }
//         })
//         let reqTop = q.leaderboardNumber | userCount;
//         sql = `SELECT username, points FROM users WHERE points IN`
//             + `(SELECT DISTINCT TOP '${reqTop}' points FROM users ORDER BY points DESC)`;
//         con.query(sql, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 throw err;
//             } else {
//                 res.status(200).send(JSON.stringify(result));
//             }
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(sc.FORBIDDEN).send("User/password not sent");
//     }
// })

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App listening on port ${PORT}`);
})

// ----------------- HELPER FUNCTIONS --------------------

// Data sanitization
// Check if input is an integer
function isInteger(str) {
    if (typeof str == 'string') {
        return false;
    }
    const num = Number(str);
    if (Number.isInteger(num)) {
        return true;
    } else {
        return false;
    }
}

//Generate login token
function generateAccessToken(username) {
    return jwt.sign(username, 'beet', { expiresIn: '7d' });
}

// Auth for JWT - intended as Express middleware fxn
// Requires the header in format:
//      Authorization: Bearer JWT_ACCESS_TOKEN
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(sc.UNAUTHORIZED);

    jwt.verify(token, TOKEN_STRING, () => {
        if (err) {
            console.log(err);
            return res.sendStatus(sc.FORBIDDEN);
        }
        req.user = user;
        next()
    })
}
