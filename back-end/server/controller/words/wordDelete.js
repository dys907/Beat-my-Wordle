//word deletion for 1 user ?username (should it be /username path instead of query??) NEW
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const wordDelete = (req, res) => {
    statReport.DELETE[API_VERSION + "words"] = statReport.DELETE[API_VERSION + "words"] + 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query["username"];
    let sql = "DELETE FROM words WHERE username=?";
    con.getConnection((err, connection) => {
        connection.query(sql, [username], (err, result) => {
            if (err) {
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error could not reach database");
            }
            if (result.affectedRows == 0) {
                res.status(sc.BAD_REQUEST).send("400: Could not find word for this user");
            } else {
                res.status(sc.OK).send("200: Word has been deleted");
            }
            connection.release();
        })
    })

}

module.exports = wordDelete;