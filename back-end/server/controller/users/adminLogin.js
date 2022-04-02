const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const crypto = require('crypto');
const adminLogin = (req, res) => {
    statReport.POST[API_VERSION + "users/adminLogin"] += 1;
    let body = req.body;
    let username = body.username;
    let password = crypto.createHash('md5').update(body.password).digest('hex');
    // Ensure the input fields exists and are not empty
    if (username && password) {
        let sql = 'SELECT * FROM admins WHERE username = ? AND password = ?';
        con.getConnection((err, connection) => {
            connection.query(sql, [username, password], function(err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    console.log(statReport);
                    res.status(sc.OK).json(statReport);
                } else {
                    res.status(sc.FORBIDDEN).send('Incorrect password or user does not exist');
                }
            });
            connection.release();
        });
    } else {
        res.status(sc.BAD_REQUEST).send('Username or password not sent');
    }
}

module.exports = adminLogin;