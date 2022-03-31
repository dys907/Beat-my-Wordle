import React from 'react';
import Button from '../../components/Button/Button';
import styles from './Homepage.module.css';
import PropTypes from 'prop-types';

const Homepage = ({ isLoggedIn, loginHandler, playBtnHandler, profileHandler, leaderboardHandler }) => {
    const loginBtnTxt = 'Login';

    return (
        <>
            <h1 className={styles.centerText}>Beat my Wordle</h1>
            {isLoggedIn ? <></> : <Button btnText={loginBtnTxt} clickHandler={loginHandler} />}

            {/* Temporary for testing, so we can access Game directly */}
            <Button btnText='Play!' clickHandler={playBtnHandler} />

            <Button btnText='Profile' clickHandler={profileHandler} />
            
            <Button btnText='Leaderboard' clickHandler={leaderboardHandler} />
        </>
    );
}

Homepage.propTypes = {
    isLoggedIn: PropTypes.bool,
    loginHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
    profileHandler: PropTypes.func,
    leaderboardHandler: PropTypes.func,
}

export default Homepage;