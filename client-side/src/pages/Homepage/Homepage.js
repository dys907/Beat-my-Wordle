import React from 'react';
import Button from '../../components/Button/Button';
import styles from './Homepage.module.css';
import PropTypes from 'prop-types';

const Homepage = ({ isLoggedIn, loginHandler, playBtnHandler, profileHandler, leaderboardHandler }) => {
    const loginBtnTxt = 'Login';
    const logoSrc = 'logo.png';

    return (
        <>
            {/* <h1 className={styles.centerText}>Beat my Wordle</h1> */}
            <img className={styles.logo} src={logoSrc} alt={"logo"} />

            <div className={styles.flex_container}>
                <div className={styles.buttonMenu}>
                    {isLoggedIn ? <></> : <Button btnText={loginBtnTxt} clickHandler={loginHandler} />}

                    {/* Temporary for testing, so we can access Game directly */}
                    <Button btnText='Play!' clickHandler={playBtnHandler} />

                    <Button btnText='Profile' clickHandler={profileHandler} />

                    <Button btnText='Leaderboard' clickHandler={leaderboardHandler} />
                </div>

                <div className={styles.game_descriptor}>
                    <h3 className={styles.desc_title}>Regular Wordle too easy? Want to play more than once a day?</h3>
                    <p>Upload your own word and pit yourself against the words of other Wordle enthusiasts. <br />
                        Battle against others and see who can get the highest score!<br />
                        Bring a new word every day because the word pool resets daily!
                    </p>
                </div>

                
            <div className={styles.how_to_div}>
                <h3 className={styles.desc_title}>How to play</h3>
                <ol className={styles.how_to}>
                    <li>Log in with an account</li>
                    <li>Visit your profile</li>
                    <li>Upload a 5 letter word</li>
                    <li>Press play to match against a random players word</li>
                    <li>Win or lose points for words you solve and each player you beat with your word!</li>
                </ol>
            </div>
            </div>
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