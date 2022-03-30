const con = require('../../../configs/dbconfigs');
const API_VERSION = "/1/";//temp
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const updateGameStatus = (req, res) => {
    statReport.PATCH[API_VERSION + "games"] = statReport.GET[API_VERSION + "games"] + 1;
    const { player, opponent } = req.body;
    let sql = "UPDATE gameLobby SET inProgress = FALSE WHERE player = ? AND opponent = ? AND inProgress = TRUE";
    con.getConnection((err, connection) => {
        con.query(sql, [player, opponent], function (err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send('500: Error updating game lobby');
            }

            if (result.changedRows == 0) {
                res.status(sc.BAD_REQUEST).send('400: Game does not exist');
            } else {
                res.status(sc.OK).send(`200: ${player} vs ${opponent} game has been concluded`);
            }
            connection.release();
        })
    });
}

module.exports = updateGameStatus;