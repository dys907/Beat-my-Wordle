//deletes all words in database (cleared end of day everyday).might change endpoint if we have better nomenclature NEW
const con = require('../configs/dbconfigs');
const API_VERSION = require('../configs/API_VERSION');
const statReport = require('../configs/statReport');

const wordDeleteAll = () => {
    statReport.DELETE[API_VERSION + "words/all"] = statReport.DELETE[API_VERSION + "words/all"] + 1;
    let sql = "DELETE FROM words";
    con.getConnection((err, connection) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err + " : " + new Date());
            }

            if (result.affectedRows == 0) {
                console.log("There are currently no entries to delete at:" + new Date());
            } else {
                console.log("All words have been deleted at: " + new Date());
            }
            connection.release();
        })
    })
}

module.exports = wordDeleteAll;