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
// Expects format
// User: username
// Password: password
// Do we have to hash it?
app.get(endPointRoot + 'user/', (req, res) => {
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    })
    let sql = "SELECT * FROM score";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status("404").send(`The database could not be reached`);
            throw err;
        } else {
            console.log("Records retrieved");
            console.log("JSON STRING:" + JSON.stringify(result));
            res.send(JSON.stringify(result));
        }
    })
})

app.get(endPointRott + 'scores/:userid', (req, res) => {
    req.params.userid
})

// Retrieve top X users by score
// leaderboardNumber
app.get(endPointRott + 'scores/leaderboard', (req, res) => {
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

//Temp user creation
app.post('login/', (req, res) => {
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
        }
    })
    let q = JSON.parse(body);

    // const jwt = require('njwt')
    // const claims = { iss: 'https://myapp.com/', sub: 'users/' }
    // const token = jwt.create(claims, 'top-secret-phrase')
    // token.setExpiration(new Date().getTime() + 60*1000)
    // res.send(token.compact())

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

// Temp update score
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

//Check if input is an integer
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