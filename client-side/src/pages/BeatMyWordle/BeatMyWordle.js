import React, { useEffect, useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';
import UploadPage from '../UploadPage/UploadPage';

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');
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
        setPageFlow('Game')
    }

    const uploadHanlder = () => {
        setPageFlow('Upload')
    }

    const postLoginHandler = () => {
        setIsLoggedIn(true);
        homeHandler();
    }

    return (
        pageFlow === 'Homepage' ?
            <Homepage isLoggedIn={isLoggedIn} loginHandler={loginHandler} playBtnHandler={playGameHandler} uploadHanlder={uploadHanlder}/>
        : pageFlow === 'Login' ?
            <LoginPage postLoginHandler={postLoginHandler} />
        : pageFlow === 'Game' ?
            <GamePage homeHandler={homeHandler}/>
        : pageFlow === 'Upload' ?
            <UploadPage homeHandler={homeHandler} playBtnHandler={playGameHandler} />
        :<></>
    );
}

export default BeatMyWordle;