const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const PRIVATE_KEY = require('../../../configs/PRIVATE_KEY');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const login = (req, res) => {
    statReport.POST[API_VERSION + "users/login"] += 1;
    let body = req.body;
    let username = body.username;
    let password = crypto.createHash('md5').update(body.password).digest('hex');
    // Ensure the input fields exists and are not empty
    if (username && password) {
        let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        con.getConnection((err, connection) => {
            connection.query(sql, [username, password], function(err, result) {
                if (err) throw err;
                if (result.length == 1) {
                    //Generate and send token for persistent login
                    const token =  jwt.sign({user: username}, 
                        PRIVATE_KEY, { expiresIn: "7 days" });
                    //res.cookie("jwt", token, { secure: true });
                    res.status(sc.OK).json({"type": "login", "access_token": token});
                    //res.status(sc.OK).send("Login successful");
                } else {
                    res.status(sc.INTERNAL_SERVER_ERROR)
                        .send('Incorrect password or user does not exist');
                }
            });
            connection.release();
        });
    } else {
        res.status(sc.BAD_REQUEST).send('Username or password not sent');
    }
}

module.exports = login;