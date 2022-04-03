const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

//checking for available matches then sending 1 match back in JSON form NEW /?username
const getGame = (req,res) => {
    statReport.GET[API_VERSION + "games/id"] = statReport.GET[API_VERSION + "games/id"] + 1;
    const parsedLink = url.parse(req.url, true);
    const username = parsedLink.query["username"];

    let sql = 'SELECT username, word FROM words WHERE username NOT IN (SELECT opponent FROM gameLobby WHERE player = ?) AND NOT username = ?;';
    con.getConnection((err,connection) => {
        connection.query(sql, [username,username], (err, result) => {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with contacting the server.");
            }
            if (result.length > 0) {
                let opponent = result[Math.floor(result.length * Math.random())];
                res.status(sc.OK).json(opponent);
            } else {
                res.status(sc.FORBIDDEN).send('There are no players available.');
            }
            connection.release();
        });
    })

}

module.exports = getGame;