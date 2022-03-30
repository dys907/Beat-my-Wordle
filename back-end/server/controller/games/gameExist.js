const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const gameExist = (req, res) => {
    statReport.GET[API_VERSION + "games/exist/id"] = statReport.GET[API_VERSION + "games/exist/id"] + 1;
    const parsedLink = url.parse(req.url, true);
    const player = parsedLink.query["player"];
    const opponent = parsedLink.query["opponent"];

    let sql = 'SELECT * FROM gameLobby WHERE player = ? AND opponent = ? AND inProgress= TRUE;';

    con.getConnection((err, connection) => {
        con.query(sql, [player, opponent], function (err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with contacting the server.");
            }
            if (result.length === 0) {
                res.status(sc.OK).send('Game lobby does not exist, can be created');
            } else {
                res.status(sc.BAD_REQUEST).send('Game lobby already exists, game lobby can not be created');
            }
            connection.release();
        });
    })
}

module.exports = gameExist;