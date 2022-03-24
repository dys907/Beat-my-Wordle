const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const url = require("url");
const app = express();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');

// ---------------------- SWAGGER PAGE ------------------------------- 
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./documents/swagger.json');
//Unsecure
const TOKEN_STRING = 'beatmywordle';
const API_VERSION = "/1/";
//Todo: initialize with fxn so verson and endpoint not repeated
let statReport = {
    "GET": {
        "/1/scores/all": 0,
        "/1/scores/id": 0,
        "/1/words/check": 0, //used
        "/1/games/id": 0, //used
        "/1/games/exist/id": 0 //used
    },
    "POST": {
        "/1/users/signup": 0,
        "/1/users/login": 0,
        "/1/users/adminLogin": 0
    },
    "PUT": {
        "/1/scores/id" : 0, 
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
    user: "itsvicly_wordle_user", // root
    password: "FHbEpZeEhiL8X3AG",
    database: "itsvicly_wordle"
})
//Establish DB connection ONCE
con.connect(function(err) {
    if (err) throw err;
})
//------------------------------------
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(function (req, res, next) {
    res.header( "Access-Control-Allow-Origin", "*");
    res.header( "Access-Control-Allow-Headers", "*");
    res.header( "Access-Control-Allow-Methods", "*");
    next();
});

// ---------------------- USER ENDPOINTS -----------------------------
// General Login - TODO: Hashing
app.post(API_VERSION + 'users/login', function(req, res) {
	// Log POST req
    statReport.POST["/1/users/login"] = statReport.POST["/1/users/login"] + 1;
    let body = req.body;
	let username = body.username;
	let password = body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
        let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
		con.query(sql, [username, password], function(err, result) {
			if (err) throw err;
			if (result.length == 1) {
				// req.session.loggedin = true;
				// req.session.username = username;

                //Generate and send token for persistent login
                const token = generateAccessToken({ username: body.username });
                res.status(200).json(token);
			} else {
				res.status(403).send('Incorrect password or user does not exist');
			}
		});
	} else {
		res.status(403).send('Username or password not sent');
	}
});

// General Signup
app.post(API_VERSION + 'users/signup/', (req, res) => {
    let q = req.body;
    statReport.POST["/1/users/signup"] = statReport.POST["/1/users/signup"]+ 1;
    let sql = `INSERT INTO users(username, password) values ('${q.username} , ${q.password})`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("DB error");
            res.status(403).send('There was a database error with your request');
            throw err;
        } else {
            res.status(200).send('Successfully created user');
        }
    })
})

//----------------------- USER GAME ENDPOINT ---------------- NEW d
//check to see if user is currently in a game, and if yes see with who and what word (JSON) /?username
//returns empty bracket if no games
app.get(API_VERSION + 'users/gamestatus', (req, res) => {
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query['username'];
    let sql = 'SELECT gl.opponent, w.word FROM gameLobby gl JOIN words w ON gl.opponent = w.username WHERE gl.player=? AND inProgress=TRUE;';
    con.query(sql,[username], function(err, result) {
        if(err) {
            res.status(500).send('Could not contact server');
        }
        res.status(200).send(JSON.stringify(result));
    })
})
// ---------------------- ADMIN ENDPOINT --------------------
// ADMIN LOGIN
app.post(API_VERSION + 'users/admin/login', (req, res) => {
    // Log POST req
    statReport.POST["/1/users/adminLogin"] = statReport.POST["/1/users/adminLogin"] + 1;
    let body = req.body;
    let username = body.username;
    let password = crypto.createHash('md5').update(body.password).digest('hex');
    // Ensure the input fields exists and are not empty
    if (username && password) {
        let sql = 'SELECT * FROM admins WHERE username = ? AND password = ?';
        con.query(sql, [username, password], function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                console.log(statReport);
                res.status(200).json(statReport);
            } else {
                res.status(403).send('Incorrect password or user does not exist');
            }
        });
    } else {
        res.status(403).send('Username or password not sent');
    }
})
//----------------------- WORD CHECK ENDPOINT --------------
// need to account for dictionaryapi site going down d
app.get(API_VERSION + 'words/check', (req, res) => {

    statReport.GET[API_VERSION + "words/check"] = statReport.GET[API_VERSION + "words/check"] + 1;

    const parsedLink = url.parse(req.url, true);
    const apiDir = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    const word = parsedLink.query["word"];

    axios({
        url: apiDir + word,
        method: 'get'
    })
        .then(response => {
            res.status(200).json({"isWord":true});
        })
        .catch((error) => {
            console.log(error);
            if(error.response.status == 404) {
                //word not found
                res.status(200).json({"isWord":false});
            }
            else {
                //server not reached
                res.status(500).send('Word could not be added, could not reach endpoint');
            }
        })
});

// ---------------------- WORD UPLOAD ENDPOINT ---------------
// TODO
// remember after signin/up implemented
// app.post(API_VERSION + 'words/upload', authenticateToken (req, res) => {
app.put(API_VERSION + 'words/upload', (req, res) => {
    statReport.PUT[API_VERSION + "words/upload"] = statReport.PUT[API_VERSION +"words/upload"] + 1;
    const { username, word } = req.body;
    // let sql = "INSERT INTO words(username, word) VALUES (?,?)";
    let sql = 'SELECT * FROM words WHERE words.username = ?;';
    con.query(sql, [username], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("500: Error with contacting the server.");
        }
        if (result.length > 0) {
            let sql2 = "UPDATE words SET word = ? WHERE username = ?"
            con.query(sql2, [word, username], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send("500: Error with uploading your word");
                } else {
                    res.status(200).send("updated");
                }

            })
        } else {
            let sql2 = "INSERT INTO words(username, word) VALUES (?,?)"
            con.query(sql2,[username,word], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send("500: Error with uploading your word");
                } else {
                    res.status(200).send("uploaded");
                }
            });
        }
    });

})

//word deletion for 1 user ?username (should it be /username path instead of query??) NEW
app.delete(API_VERSION + 'words',(req,res)=> {
    statReport.DELETE[API_VERSION + "words/id"] = statReport.DELETE[API_VERSION +"words/id"] + 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query["username"];
    let sql = "DELETE FROM words WHERE Username=?";
    con.query(sql,[username], function(err,result) {
        if(err) {
            res.status(500).send("500: Error could not reach database");
        }
        //console.log(result);
        console.log(result.affectedRows);
        if(result.affectedRows == 0) {
            res.status(400).send("400: Could not find word for this user");
        } else {
            res.status(200).send("200: Word has been deleted");
        }

    })

})
//deletes all words in database (cleared end of day everyday).might change endpoint if we have better nomenclature NEW
app.delete(API_VERSION + 'words/all',(req,res)=> {
    statReport.DELETE[API_VERSION + "words/all"] = statReport.DELETE[API_VERSION +"words/all"] + 1;
    let sql = "DELETE FROM words";
    con.query(sql, function(err,result) {
        if(err) {
            res.status(500).send("500: Error could not reach database");
        }

        if(result.affectedRows == 0) {
            res.status(200).send("200: There are currently no entries to delete");
        } else {
            res.status(200).send("200: All words have been deleted");
        }

    })
})

//----------------------- MATCHMAKING ENDPOINT -------------- NEW

//checking for available matches then sending 1 match back in JSON form NEW /?username
app.get(API_VERSION + 'games', (req,res) => {
    statReport.GET[API_VERSION + "games/id"] = statReport.GET[API_VERSION + "games/id"] + 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query["username"];

    let sql = 'SELECT username, word FROM words WHERE username NOT IN (SELECT opponent FROM gameLobby WHERE player = ?) AND NOT username = ?;';
    con.query(sql, [username,username], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("500: Error with contacting the server.");
        }
        if (result.length > 0) {
            let opponent = result[Math.floor(result.length * Math.random())];
            res.status(200).json(opponent);
        } else {
            res.status(403).send('There are no players available.');
        }
    });
})
//check if lobby already exists in database (security) NEW /?player=&opponent= work on this
app.get(API_VERSION + 'games/exist', (req,res,next)=> {
    statReport.GET[API_VERSION + "games/exist/id"] = statReport.GET[API_VERSION + "games/exist/id"] + 1;
    const parsedLink = url.parse(req.url, true);
    const player = parsedLink.query["player"];
    const opponent = parsedLink.query["opponent"];

    let sql = 'SELECT * FROM gameLobby WHERE player = ? AND opponent = ? AND inProgress= TRUE;';

    con.query(sql, [player, opponent], function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("500: Error with contacting the server.");
        }
        if(result.length === 0) {
            res.status(200).send('Game lobby does not exist, can be created');
        } else {
            res.status(400).send('Game lobby already exists, game lobby can not be created');
        }
    });
})
//Queue game and create match in lobby history body {player,opponent}
app.post(API_VERSION + 'games', (req,res)=> {
    statReport.POST[API_VERSION + "games"] = statReport.GET[API_VERSION + "games"] + 1;
    const { player, opponent } = req.body;
    let sql = "INSERT INTO gameLobby(player, opponent, inProgress) VALUES (?,?,TRUE)";
    con.query(sql, [player, opponent], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send("400: Error with creating game lobby");
        } 
        res.status(200).send("200: Game created successfully");
    });
});
//Alter the game state from inprogress to false (quit or finish game) body username(player)
app.patch(API_VERSION + 'games',(req,res,next)=> {
    statReport.PATCH[API_VERSION + "games"] = statReport.GET[API_VERSION + "games"] + 1;
    const {player,opponent} = req.body;
    let sql = "UPDATE gameLobby SET inProgress = FALSE WHERE player = ? AND opponent = ? AND inProgress = TRUE";
    con.query(sql, [player,opponent], function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).send('500: Error updating game lobby');
        }
        //console.log(result);
        if(result.changedRows == 0) {
            res.status(400).send('400: Game does not exist');
        } else {
            res.status(200).send(`200: ${player} vs ${opponent} game has been concluded`);
        }

    })
})

//delete all game lobbies (done at end of day)
app.delete(API_VERSION + 'games/all',(req,res)=> {
    statReport.DELETE[API_VERSION + "games/all"] = statReport.DELETE[API_VERSION + "games/all"] + 1;
    let sql = "DELETE FROM gamelobby";
    con.query(sql, function(err,result) {
        if(err) {
            res.status(500).send("500: Error could not reach database");
        }

        if(result.affectedRows == 0) {
            res.status(200).send("200: There are currently no entries to delete");
        } else {
            res.status(200).send("200: All match histories have been deleted");
        }

    })
})

// ---------------------- SCOREBOARD ENDPOINT ---------------
//Scoreboard
// app.get('scores/:userid', (req, res) => {
//     //
// })

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
//         res.status(404).send("User/password not sent");
//     }
// })

// app.post('game/', (req, res) => {
//     // To prevent premature termination
//     req.setTimeout(100000);
//     let body = "";
//     req.on('data', function (chunk) {
//         if (chunk != null) {
//             body += chunk;
//         }
//     })
//     req.on('end', function () {
//         console.log("Full body: " + body);
//         let q = JSON.parse(body);
//         if ((q.name == null) | (q.score == null)) {
//             console.log("Received post with missing params");
//             res.status(404).send('Error: Your POST was missing parameters');
//         } else if (!isInteger(q.score)) {
//             console.log("Received post with non-int score");
//             res.status(404).send('Error: Your score is not an integer');
//         } else {
//             let sql = `INSERT INTO score(name, score) values ('${q.name}', ${q.score})`;
//             con.query(sql, function (err, result) {
//                 if (err) {
//                     console.log("POST DB ERROR!");
//                     res.status(404).send('There was a database error on inserting your request');
//                     throw err
//                 };
//                 console.log("1 record inserted sucessfully");
//             })
//             res.status(200).send(`${q.name}:${q.score} was stored in the DB`);
//         }
//     })
// })

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App listening on port ${PORT}`);
})

// ----------------- HELPER FUNCTIONS --------------------

// Data sanitization
// Check if input is an integer
function isInteger(str) {
    if (typeof str !== 'string') {
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
    return jwt.sign(username, 'beatmywordle', { expiresIn: '1800s' });
}

// Auth for JWT - intended as Express middleware fxn
// Requires the header in format:
//      Authorization: Bearer JWT_ACCESS_TOKEN
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, TOKEN_STRING, () => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next()
    })
}
