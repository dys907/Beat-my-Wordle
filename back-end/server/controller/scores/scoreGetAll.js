const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

//For getting all user's scores
const scoreGetAll = (req, res) => {
    statReport.GET[API_VERSION + "scores/all"] += 1;
    let sql = "SELECT username, score FROM scores ORDER BY score DESC";
    con.getConnection((err, connection) => {
        connection.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("Internal server error");
            } else {
                res.status(sc.OK).send(JSON.stringify(result));
            }
        })
        connection.release();
    });
};
module.exports = scoreGetAll;