import React, { useState } from 'react';
import Homepage from '../Homepage/Homepage';
import GamePage from '../GamePage/GamePage';
import LoginPage from '../LoginPage/LoginPage';

const BeatMyWordle = () => {
    //Homepage, Login, Game, 
    const [pageFlow, setPageFlow] = useState('Homepage');

    const loginHandler = () => {
        setPageFlow('Login')
    }

    //TEMPORARY FOR TESTING
    const playGameHandler = () => {
        setPageFlow('Game')
    }

    return (
        pageFlow === 'Homepage' ?
            <Homepage pageFlow={pageFlow} loginHandler={loginHandler} playBtnHandler={playGameHandler}/>
        : pageFlow === 'Login' ?
            <LoginPage />
        : pageFlow === 'Game' ?
            <GamePage />
        : <></>
    );
}

export default BeatMyWordle;