import React, { useEffect, useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';
import UploadPage from '../UploadPage/UploadPage';

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');
    const [word, setWord] = useState();
    const [gameOpponent, setGameOpponent] = useState();
    const [gameResult, setGameResult] = useState(0);

    const xhttp = new XMLHttpRequest();
    const userID = "player2" // testing
    const endPointRoot = "https://wordle.itsvicly.com/";
    const [isLoggedIn, setIsLoggedIn] = useState();

    //Will probably need some kind of token check for login status
    // useEffect(() => {})

    const homeHandler = () => {
        setPageFlow("Homepage")
    }

    const loginHandler = () => {
        setPageFlow('Login')
    }

    //TEMPORARY FOR TESTING
    const playGameHandler = () => {


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

    const uploadHanlder = () => {
        setPageFlow('Upload')
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

    const postLoginHandler = () => {
        setIsLoggedIn(true);
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
            <Homepage isLoggedIn={isLoggedIn} loginHandler={loginHandler} playBtnHandler={playGameHandler} uploadHanlder={uploadHanlder}/>
        : pageFlow === 'Login' ?
            <LoginPage postLoginHandler={postLoginHandler} />
        : pageFlow === 'Game' ?
            <GamePage homeHandler={homeHandler} word={word} gameResult={setGameResult}/>
        : pageFlow === 'Upload' ?
            <UploadPage homeHandler={homeHandler} playBtnHandler={playGameHandler} />
        :<></>
    );
}

export default BeatMyWordle;