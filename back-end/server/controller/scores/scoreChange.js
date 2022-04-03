const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const isInteger = require("../../../helper/helpers");

const query = (connector, sql, args) => {
    return new Promise((resolve, reject) => {
        connector.query(sql, args, (err, result) => {
            if (err) { reject(new Error()); }
            else { resolve(result); }
        });
    })
};
// For updating a user's score
const scoreChange = (req, res) => {
    statReport.POST[API_VERSION + "scores"] += 1;
    const body = req.body;
    const username = body.username;
    const scoreAddition = body.score;

    if (isInteger(scoreAddition)) {
        con.getConnection((err, connection) => {
            //Promise structure
            connection.promise = query;
            let sql = "SELECT score FROM scores WHERE username=?";
            connection.promise(connection, sql, [username]).then((result, err) => {
                if (result.length === 1) {
                    const newScore = result[0].score + scoreAddition;
                    sql = `UPDATE scores SET score=? WHERE username=?`;
                    return connection.promise(connection, sql, [newScore, username]);
                } else if (result.length === 0) {
                    throw "User does not exist";
                }
            }).then((result) => {
                res.status(sc.OK).send("Score updated successfully")
            }).catch((err) => {
                console.log(err);
                if (err !== "User does not exist") {
                    res.status(sc.INTERNAL_SERVER_ERROR).send("500: Internal server error");
                } else {
                    res.status(sc.INTERNAL_SERVER_ERROR).send("500: " + err);
                }
            });
            connection.release();
        });
    } else {
        res.status(sc.FORBIDDEN).send("Invalid request - score increment must be an integer")
    }
};

module.exports = scoreChange;