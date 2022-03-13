const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const app = express();
const jwt = require('jsonwebtoken');
//Unsecure
const TOKEN_STRING = 'beatmywordle';
const API_VERSION = "/1/";
let statReport = {
    get: {
        scoreboard: 0,
    },
    post: {
        login: 0,
        signup: 0,
        adminLogin: 0,
        scoreboard: 0
    }
};

//-------------------------------------
const con = mysql.createConnection({
    host: "localhost",
    user: "wordleServer",
    password: "",
    database: "wordle"
})
//Establish DB connection ONCE
con.connect(function(err) {
    if (err) throw err;
})
//------------------------------------

app.use(function (req, res, next) {
    res.header( "Access-Control-Allow-Origin", "*");
    res.header( "Access-Control-Allow-Methods", "*");
    next();
});

// ---------------------- USER ENDPOINTS -----------------------------
// General Login - TODO: Hashing
app.post(API_VERSION + 'users/login', function(req, res) {
	// Log POST req
    statReport.post.login = statReport.post.login + 1;
    let body = req.body;
	let username = body.username;
	let password = body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
        let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
		connection.query(sql, [username, password], function(err, result) {
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
app.post(API_VERSION + '/users/signup/', (req, res) => {
    let q = req.body;
    statReport.post.signup = statReport.post.signup + 1;

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
// ---------------------- ADMIN ENDPOINT --------------------
// ADMIN LOGIN
// Opted for no JWT and therefore no session persistence
app.post(API_VERSION + '/users/admin/login', (req, res) => {
    // Log POST req
    statReport.post.adminLogin = statReport.post.adminLogin + 1;
    let body = req.body;
    let username = body.username;
    let password = body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        let sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
        connection.query(sql, [username, password], function(err, result) {
            if (err) throw err;
            if (result.length == 1) {
                res.status(200).json(statReport);
            } else {
                res.status(403).send('Incorrect password or user does not exist');
            }
        });
    } else {
        res.status(403).send('Username or password not sent');
    }
})

// ---------------------- SCOREBOARD ENDPOINT ---------------
//Scoreboard
app.get('scores/:userid', (req, res) => {
    //
})

// Scoreboard
// Retrieve top X users by score
// leaderboardNumber
app.get('scores/leaderboard', (req, res) => {
    let userCount = 0;
    let q = req.body;
    let userCountSql = "SELECT COUNT(UserID) FROM users";
    try {
        con.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log(result);
                userCount = result;
            }
        })
        let reqTop = q.leaderboardNumber | userCount;
        sql = `SELECT username, points FROM users WHERE points IN`
            + `(SELECT DISTINCT TOP '${reqTop}' points FROM users ORDER BY points DESC)`;
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.status(200).send(JSON.stringify(result));
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).send("User/password not sent");
    }
})

app.post('game/', (req, res) => {
    // To prevent premature termination
    req.setTimeout(100000);
    let body = "";
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    })
    req.on('end', function () {
        console.log("Full body: " + body);
        let q = JSON.parse(body);
        if ((q.name == null) | (q.score == null)) {
            console.log("Received post with missing params");
            res.status(404).send('Error: Your POST was missing parameters');
        } else if (!isInteger(q.score)) {
            console.log("Received post with non-int score");
            res.status(404).send('Error: Your score is not an integer');
        } else {
            let sql = `INSERT INTO score(name, score) values ('${q.name}', ${q.score})`;
            con.query(sql, function (err, result) {
                if (err) {
                    console.log("POST DB ERROR!");
                    res.status(404).send('There was a database error on inserting your request');
                    throw err
                };
                console.log("1 record inserted sucessfully");
            })
            res.status(200).send(`${q.name}:${q.score} was stored in the DB`);
        }
    })
})

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
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, TOKEN_STRING, () => {
      
      if (err) {
        console.log(err)
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  }