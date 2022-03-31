import React, { useEffect, useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import LeaderboardPage from "../LeaderboardPage/LeaderboardPage";

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');
    const [word, setWord] = useState();
    const [gameOpponent, setGameOpponent] = useState();
    const [gameResult, setGameResult] = useState(0);
    const [score, setScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState("");
    const [ownWord, setOwnWord] = useState("")

    const xhttp = new XMLHttpRequest();
    const userID = "player1" // testing
    const endPointRoot = "https://wordle.itsvicly.com/";
    const [isLoggedIn, setIsLoggedIn] = useState();

    //Will probably need some kind of token check for login status
    useEffect(() => {
        if (sessionStorage.getItem('username')) {
            setIsLoggedIn(true);
        }
    },[])

    const homeHandler = () => {
        setPageFlow("Homepage")
    }

    const loginHandler = () => {
        setPageFlow('Login')
    }

    //TEMPORARY FOR TESTING
    const playGameHandler = () => {

        setGameResult(0);


        checkGameStatus().then((res) => {
            let response = JSON.parse(res);
            console.log(response)
            if (response.length == 0) {
                lookForGame().then((res2) => {
                    createLobby(res2).then(() => {
                        setPageFlow('Game')
                    })
                })
            } else {
                setGameOpponent(response[0].opponent);
                setWord(response[0].word);
                setPageFlow('Game')
            }
        })



    }

    const profileHandler = () => {

        checkScore().then((res) => {
            let response = JSON.parse(res);
            let s = response[0].score;
            setScore(s)
            checkWord().then((res2) => {
                let response2 = JSON.parse(res2);
                let s2 = response2.word;
                setOwnWord(s2);
                setPageFlow('Profile')
            })
        })
    }

    const leaderboardHandler = () => {
        getLeaderboard().then((res) => {
            setLeaderboard(res);
            setPageFlow('Leaderboard')
        })
    }

    const getLeaderboard = () => {
        return new Promise((res, rej) => {
            const resourceScore = "1/scores/all";
            xhttp.open("GET", endPointRoot + resourceScore, true);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send();
        })
    }

    const checkScore = () => {
        return new Promise((res, rej) => {
            const resourceScore = "1/scores/?username=" + userID;
            xhttp.open("GET", endPointRoot + resourceScore, true);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send();
        })
    }

    const checkWord = () => {
        return new Promise((res, rej) => {
            const resourceWord = "1/words/?username=" + userID;
            xhttp.open("GET", endPointRoot + resourceWord, true);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send();
        })
    }

    const checkGameStatus = () => {
        return new Promise((res, rej) => {

            const resourceCheck = "1/users/gamestatus/?username=" + userID;
            xhttp.open("GET", endPointRoot + resourceCheck, true);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send();
        })
    }

    const lookForGame = () => {
        return new Promise((res, rej) => {

            const resourceLook = "1/games/?username=" + userID;
            xhttp.open("GET", endPointRoot + resourceLook, true);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else if (xhttp.status === 403) {
                    rej(xhttp.statusText)
                    alert("No games available")
                }
            }
            xhttp.send();
        })
    }

    const createLobby = (res) => {
        console.log(res);
        const response = JSON.parse(res);
        const opponent = response.username;
        setGameOpponent(opponent);
        setWord(response.word);
        return new Promise((res, rej) => {
            const resourceCreate = "1/games";
            xhttp.open("POST", endPointRoot + resourceCreate, true);
            xhttp.setRequestHeader("Content-type","application/json");
            const jsonObj = {
                player: userID,
                opponent: opponent,
            }
            const params = JSON.stringify(jsonObj);
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send(params);
        })
    }

    const postLoginHandler = (user) => {
        setIsLoggedIn(true);
        sessionStorage.setItem('username', user);
        homeHandler();
    }

    useEffect(() => {
        if (gameResult !== 0) {
            const resourcePatch = "1/games";
            const params = JSON.stringify({
                player: userID,
                opponent: gameOpponent,
            })
            xhttp.open('PATCH',endPointRoot + resourcePatch, true);
            xhttp.setRequestHeader("Content-type","application/json");
            xhttp.send(params);
        }
    }, [gameResult])

    return (
        pageFlow === 'Homepage' ?
            <Homepage 
                isLoggedIn={isLoggedIn} 
                loginHandler={loginHandler} 
                playBtnHandler={playGameHandler} 
                profileHandler={profileHandler} 
                leaderboardHandler={leaderboardHandler}
            />
        : pageFlow === 'Login' ?
            <LoginPage postLoginHandler={postLoginHandler} homeHandler={homeHandler} />
        : pageFlow === 'Game' ?
            <GamePage homeHandler={homeHandler} word={word} gameResult={setGameResult}/>
        : pageFlow === 'Profile' ?
            <ProfilePage score={score} homeHandler={homeHandler} playBtnHandler={playGameHandler} ownWord={ownWord} setOwnWord={setOwnWord}/>
        : pageFlow === 'Leaderboard' ?
            <LeaderboardPage homeHandler={homeHandler} playBtnHandler={playGameHandler} jsonList={leaderboard}/>
            :
        <></>
    );
}

export default BeatMyWordle;