const crypto = require('crypto');
const PRIVATE_KEY = crypto.randomBytes(64).toString('hex');
module.exports = PRIVATE_KEY;