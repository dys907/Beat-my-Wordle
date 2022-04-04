const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const url = require("url");

//For getting a user's score
const scoreGet = (req, res) => {
    statReport.GET[API_VERSION + "scores"] += 1;
    const username = url.parse(req.url, true).query["username"];
    let sql = "SELECT score FROM scores WHERE username = ?";
    con.getConnection((err, connection) => {
        connection.query(sql, [username], (err, result) => {
            if (err) {
                res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
            } else if (result.length === 1) {
                res.status(sc.OK).send(JSON.stringify(result));
            } else {
                res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
            }
        })
        connection.release();
    });
};

module.exports = scoreGet;