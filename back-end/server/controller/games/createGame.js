const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const createGame = (req, res) => {
    statReport.POST[API_VERSION + "games"] = statReport.POST[API_VERSION + "games"] + 1;
    const { player, opponent } = req.body;
    let sql = "INSERT INTO gameLobby(player, opponent, inProgress) VALUES (?,?,TRUE)";
    con.getConnection((err, connection) => {
        connection.query(sql, [player, opponent],  (err, result) => {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with creating game lobby");
                connection.release();
            }
            res.status(sc.OK).send("200: Game created successfully");
            connection.release();
        });
    })
}

module.exports = createGame;