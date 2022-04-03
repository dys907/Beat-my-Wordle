const con = require('../configs/dbconfigs');

const matchDeleteAll = () => {
    let sql = "DELETE FROM gameLobby";
    con.getConnection((err, connection) => {
        connection.query(sql, (err, result) => {
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