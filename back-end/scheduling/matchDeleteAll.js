const con = require('../configs/dbconfigs');
const API_VERSION = require('../configs/API_VERSION');
const statReport = require('../configs/statReport');

const matchDeleteAll = () => {
    statReport.DELETE[API_VERSION + "games/all"] = statReport.DELETE[API_VERSION + "games/all"] + 1;
    let sql = "DELETE FROM gameLobby";
    con.getConnection((err, connection) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err + " : " + new Date());
            }

            if (result.affectedRows == 0) {
                console.log("There are currently no entries to delete at: " + new Date());
            } else {
                console.log("All match histories have been deleted at: " + new Date());
            }
            connection.release();
        })
    })
}

module.exports = matchDeleteAll;