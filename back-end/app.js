const express = require("express");
const { chown } = require("fs");
const { createRequire } = require("module");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const app = express();

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const endPointRoot = "/API/v1/";

let statReport = {
    getLogin: 0,
    postSignup: 0,
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


// LOGIN
// User: username
// Password: password
app.get(endPointRoot + 'login', (req, res) => {
    statReport.getLogin = statReport.getLogin + 1;
    let body = req.body;
    // LOGIN LOGIC
})

//Scoreboard
app.get(endPointRoot + 'scores/:userid', (req, res) => {
    //
})

// Scoreboard
// Retrieve top X users by score
// leaderboardNumber
app.get(endPointRoot + 'scores/leaderboard', (req, res) => {
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
                throw err;
            } else {
                res.status(200).send(JSON.stringify(result));
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).send("A DB error occured with your request");
    }
})

// Signup
app.post('signup/', (req, res) => {
    let q = req.body;
    statReport.postSignup = statReport.postSignup + 1;

    let sql = `INSERT INTO users(username, password) values ('${q.username} , ${q.password})`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("DB error");
            res.status(404).send('There was a database error with your request');
            throw err;
        } else {
            res.status(200).send('Successfully created user');
        }
    })
})

// ADMIN LOGIN
app.get('adminLogin/', (req, res) => {
    let body = req.body;
    //PLACEHOLDER CHECK - REPLACE WITH DATABASE CHECK + HASHING
    if (body.user == admin && body.pass == '1234abcd') {
        res.status(200).send(JSON.stringify(statReport));
    } else {
        res.status(403).send('Error - invalid credentials');
    }
})

// WIP update score
app.post(endPointRoot + 'game/', (req, res) => {
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

//Data sanitization
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