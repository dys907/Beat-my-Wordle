// ---------------------- get currently uploaded word-----------
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const wordView = (req, res) => {
    statReport.GET[API_VERSION + "words"] = statReport.GET[API_VERSION + "words"] + 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query["username"];

    let sql = 'SELECT words.word FROM words WHERE words.username = ?;';
    con.getConnection((err, connection) => {
        connection.query(sql, [username], function (err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with contacting the server.");
            }
            if (result.length > 0) {
                res.status(sc.OK).json({ "word": result[0].word });
            } else {
                res.status(sc.OK).json({ "word": "" });
            }
            connection.release();
        })
    })
}

module.exports = wordView;