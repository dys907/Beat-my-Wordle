const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const PRIVATE_KEY = require("../../../configs/PRIVATE_KEY");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
console.log(con);
const signup = (req, res) => {
    let q = req.body;
    let username = q.username;
    let password = crypto.createHash('md5').update(q.password).digest('hex');
    statReport.POST[API_VERSION + "users/signup"] += 1;
    con.getConnection((err, connection) => {
        let sql = "INSERT INTO users(username, password) values (? , ?)";
        console.log(sql);
        connection.query(sql, [username, password], function (err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR);
            } else {
                const token =  jwt.sign({user: username}, 
                    PRIVATE_KEY, { expiresIn: "7 days" });
                res.cookie("jwt", token, { secure: true, httpOnly: true});
                res.status(sc.OK).send("Successfully signed up");
            }
            connection.release();
        })
    });
}

module.exports = signup;