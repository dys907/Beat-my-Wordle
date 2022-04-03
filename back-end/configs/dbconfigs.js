const mysql = require("mysql");

const con = mysql.createPool({
    host: "localhost",
    user: "itsvicly_wordle_user",
    password: "FHbEpZeEhiL8X3AG",
    database: "itsvicly_wordle"
});

module.exports = con;