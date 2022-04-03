    // ---------------------- WORD UPLOAD ENDPOINT ---------------
// TODO
// remember after signin/up implemented
// app.post(API_VERSION + 'words/upload', authenticateToken (req, res) => {
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const VALID_WORD_LENGTH = 5;
const wordUpdate = (req, res) => {
    statReport.PUT[API_VERSION + "words/update"] = statReport.PUT[API_VERSION + "words/update"] + 1;
    const { username, word } = req.body;
    if (word.length != VALID_WORD_LENGTH) {
        res.status(sc.BAD_REQUEST).send("400: Word must be 5 letters");
    } else {
        con.getConnection((err, connection) => { //need to test this one
            let sql = "UPDATE words SET word = ? WHERE username = ?"
            connection.query(sql, [word, username], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with updating your word");
                } else {
                    res.status(sc.OK).send("200: Word has been updated");
                }

            })
        })
    }
}

module.exports = wordUpdate;