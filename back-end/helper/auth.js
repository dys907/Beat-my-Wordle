const jwt = require('jsonwebtoken');
const sc = require('../../../configs/httpResponseCodes');
const PRIVATE_KEY = require('../../../configs/TOKEN');

// Auth for JWT - intended as Express middleware fxn
// Requires the header in format:
//      Authorization: Bearer JWT_ACCESS_TOKEN
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(sc.UNAUTHORIZED);

    jwt.verify(token, PRIVATE_KEY, () => {
        if (err) {
            console.log(err);
            return res.sendStatus(sc.FORBIDDEN);
        }
        req.user = user;
        next()
    })
}

module.exports = authenticateToken