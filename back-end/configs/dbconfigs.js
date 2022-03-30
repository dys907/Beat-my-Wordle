const mysql = require("mysql");

const con = mysql.createPool({
    host: "localhost",
    user: "root", //"/itsvicly_wordle_user",
    password: "", //"FHbEpZeEhiL8X3AG",
    database: "itsvicly_wordle"
});

module.exports = con;