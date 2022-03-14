import React, { useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';
import UploadPage from '../UploadPage/UploadPage';

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');

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

    return (
        pageFlow === 'Homepage' ?
            <Homepage pageFlow={pageFlow} loginHandler={loginHandler} playBtnHandler={playGameHandler} uploadHanlder={uploadHanlder}/>
        : pageFlow === 'Login' ?
            <LoginPage />
        : pageFlow === 'Game' ?
            <GamePage />
        : pageFlow === 'Upload' ?
            <UploadPage homeHandler={homeHandler} playBtnHandler={playGameHandler} />
        :<></>
    );
}

export default BeatMyWordle;