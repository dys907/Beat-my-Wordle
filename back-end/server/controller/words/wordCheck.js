const axios = require('axios');
const API_VERSION = require('../../../configs/API_VERSION');
const url = require("url");
const statReport = require('../../../configs/statReport');
const sc = require('../../../configs/httpResponseCodes');

const wordCheck = (req, res) => {

    statReport.GET[API_VERSION + "words/check"] = statReport.GET[API_VERSION + "words/check"] + 1;

    const parsedLink = url.parse(req.url, true);
    const apiDir = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    const word = parsedLink.query["word"];

    axios({
        url: apiDir + word,
        method: 'get'
    })
        .then(response => {
            res.status(sc.OK).json({ "isWord": true });
        })
        .catch((error) => {
            if (error.response.status == sc.NOT_FOUND) {
                //word not found
                res.status(sc.OK).json({ "isWord": false });
            }
            else {
                //server not reached
                res.status(sc.INTERNAL_SERVER_ERROR).send('Word could not be added, could not reach endpoint');
            }
        });
}

module.exports = wordCheck;