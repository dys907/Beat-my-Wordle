let statReport = {
    "GET": {
        "/1/scores/all": 0, //used
        "/1/scores": 0, //used
        "/1/words/check": 0, //used
        "/1/games": 0, //used
        "/1/words": 0, // used
        "/1/users/gamestatus": 0
    },
    "POST": {
        "/1/scores" : 0, 
        "/1/users/signup": 0,
        "/1/users/login": 0,
        "/1/users/logout": 0,
        "/1/users/adminLogin": 0,
        "/1/games": 0
    },
    "PUT": {
        "/1/words/upload": 0, //used
        "/1/words/update": 0
    },
    "DELETE": {
        "/1/words": 0 //used
    },
    "PATCH": {
        "/1/games": 0 //used
    }
};

module.exports = statReport;