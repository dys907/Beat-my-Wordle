//Invalidates JWT on server
const con = require('../../../configs/dbconfigs');
const API_VERSION = require('../../../configs/API_VERSION');
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');
const PRIVATE_KEY = require('../../../configs/PRIVATE_KEY');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const logout = (req, res) => {
    statReport.POST[API_VERSION + "users/logout"] += 1;
    let body = req.body;
    let username = body.username;
    // Ensure the input fields exists and are not empty
    if (username) {
        const token =  jwt.sign({user: username}, PRIVATE_KEY, { expiresIn: "1 s" });
        res.status(sc.OK).send("Invalidated token")
    } else {
        res.status(sc.BAD_REQUEST).send("Username not sent");
    }
}

module.exports = logout;