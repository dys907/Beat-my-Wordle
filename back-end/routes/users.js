const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// ---------------------- USER ENDPOINTS -----------------------------
module.exports = function(app, API_VERSION, con, TOKEN_STRING, statReport) {
    // General Login
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
                    //Generate and send token for persistent login
                    const token = generateAccessToken({ username: body.username });
                    res.cookie("jwt", TOKEN_STRING, { secure: true, httpOnly: true});
                    res.status(200).send("Login successful");
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
        let sql = "INSERT INTO users(username, password) values (? , ?)";
        console.log(sql);
        con.query(sql, [q.username, q.password], function (err, result) {
            if (err) {
                console.log("DB error");
                res.status(403).send('There was a database error with your request');
                throw err;
            } else {
                res.cookie("jwt", token, { secure: true, httpOnly: true});
                res.status(200).send("Successfully signed up");
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