// ---------------------- WORD UPLOAD ENDPOINT ---------------
// TODO
// remember after signin/up implemented
// app.post(API_VERSION + 'words/upload', authenticateToken (req, res) => {
const con = require("../../../configs/dbconfigs");
const API_VERSION = require("../../../configs/API_VERSION");
const statReport = require("../../../configs/statReport");
const sc = require("../../../configs/httpResponseCodes");
const VALID_WORD_LENGTH = 5;
const wordUpload = (req, res) => {
  statReport.PUT[API_VERSION + "words/upload"] =
    statReport.PUT[API_VERSION + "words/upload"] + 1;
  const { username, word } = req.body;
  if (word.length != VALID_WORD_LENGTH) {
    res.status(sc.BAD_REQUEST).send("400: Word must be 5 letters");
  } else {
    // let sql = "INSERT INTO words(username, word) VALUES (?,?)";
    let sql = "INSERT INTO words(username, word) VALUES (?,?)";
    con.getConnection((err, connection) => {
      //need to test this one
      connection.query(sql, [username, word],  (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(sc.INTERNAL_SERVER_ERROR)
            .send("500: Error with uploading your word");
        } else {
          res.status(sc.OK).send("200: Word has been uploaded");
        }
      });
    });
  }
};

module.exports = wordUpload;
