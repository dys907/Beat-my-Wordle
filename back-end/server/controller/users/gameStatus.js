const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

//check to see if user is currently in a game, and if yes see with who and what word (JSON) /?username
//returns empty bracket if no games
const gameStatus = (req, res) => {
    statReport.GET[API_VERSION + "users/gamestatus"] += 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query['username'];
    let sql = 'SELECT gl.opponent, w.word FROM gameLobby gl JOIN words w ON gl.opponent = w.username WHERE gl.player=? AND inProgress=TRUE;';
    con.getConnection((err, connection) => {
        con.query(sql, [username], function (err, result) {
            if (err) {
                res.status(sc.INTERNAL_SERVER_ERROR).send('Could not contact server');
            }
            res.status(sc.OK).send(JSON.stringify(result));
        })
        connection.release();
    })
}

module.exports = gameStatus;