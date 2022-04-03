//deletes all words in database (cleared end of day everyday).might change endpoint if we have better nomenclature NEW
const con = require('../configs/dbconfigs');

const wordDeleteAll = () => {
    let sql = "DELETE FROM words";
    con.getConnection((err, connection) => {
        connection.query(sql, (err, result) => {
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