//deletes all words in database (cleared end of day everyday).might change endpoint if we have better nomenclature NEW
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const wordDeleteAll = (req, res) => {
    statReport.DELETE[API_VERSION + "words/all"] = statReport.DELETE[API_VERSION + "words/all"] + 1;
    let sql = "DELETE FROM words";
    con.getConnection((err, connection) => {
        connection.query(sql, function (err, result) {
            if (err) {
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error could not reach database");
            }

            if (result.affectedRows == 0) {
                res.status(sc.OK).send("200: There are currently no entries to delete");
            } else {
                res.status(sc.OK).send("200: All words have been deleted");
            }
            connection.release();
        })
    })
}

module.exports = wordDeleteAll;