import React, { useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';
import UploadPage from '../UploadPage/UploadPage';

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');
    const [word, setWord] = useState();

    const xhttp = new XMLHttpRequest();
    const userID = "dylan" // testing
    const endPointRoot = "https://wordle.itsvicly.com/";

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
            if (!response.length == 0) {
                lookForGame().then((res2) => {
                    createLobby(res2).then(() => {
                        setPageFlow('Game')
                    })
                })
            }
        })



    }

    const uploadHanlder = () => {
        setPageFlow('Upload')
    }

    const checkGameStatus = () => {
        return new Promise((res, rej) => {

            const resourceCheck = "1/users/gamestatu/?username=" + userID;
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
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send();
        })
    }

    const createLobby = (res) => {
        const response = JSON.parse(res);
        const opponent = response.opponent;
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

    return (
        pageFlow === 'Homepage' ?
            <Homepage pageFlow={pageFlow} loginHandler={loginHandler} playBtnHandler={playGameHandler} uploadHanlder={uploadHanlder}/>
        : pageFlow === 'Login' ?
            <LoginPage />
        : pageFlow === 'Game' ?
            <GamePage homeHandler={homeHandler} word={word}/>
        : pageFlow === 'Upload' ?
            <UploadPage homeHandler={homeHandler} playBtnHandler={playGameHandler} />
        :<></>
    );
}

export default BeatMyWordle;