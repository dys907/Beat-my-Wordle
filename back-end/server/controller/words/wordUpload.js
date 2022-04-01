// ---------------------- WORD UPLOAD ENDPOINT ---------------
// TODO
// remember after signin/up implemented
// app.post(API_VERSION + 'words/upload', authenticateToken (req, res) => {
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const wordUpload = (req, res) => {
    statReport.PUT[API_VERSION + "words/upload"] = statReport.PUT[API_VERSION + "words/upload"] + 1;
    const { username, word } = req.body;
    // let sql = "INSERT INTO words(username, word) VALUES (?,?)";
    let sql = 'SELECT * FROM words WHERE words.username = ?;';
    con.getConnection((err, connection) => { //need to test this one
        con.query(sql, [username], function (err, result) {
            if (err) {
                console.log(err);
                res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with contacting the server.");
            }
            if (result.length > 0) {
                let sql2 = "UPDATE words SET word = ? WHERE username = ?"
                con.query(sql2, [word, username], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with uploading your word");
                    } else {
                        res.status(sc.OK).send("200: Word has been updated");
                    }

                })
            } else {
                let sql2 = "INSERT INTO words(username, word) VALUES (?,?)"
                con.query(sql2, [username, word], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(sc.INTERNAL_SERVER_ERROR).send("500: Error with uploading your word");
                    } else {
                        res.status(sc.OK).send("200: Word has been uploaded");
                    }
                });
            }
            connection.release();
        });
    })
}

module.exports = wordUpload;