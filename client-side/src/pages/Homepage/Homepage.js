import React from 'react';
import Button from '../../components/Button/Button';
import styles from './Homepage.module.css';
import PropTypes from 'prop-types';

const Homepage = ({ isLoggedIn, loginHandler, playBtnHandler, profileHandler, leaderboardHandler, logoutHandler }) => {
    const loginBtnTxt = 'Login';
    const logoSrc = 'logo.png';
    const playBtnTxt = 'Play!';
    const profileBtnTxt = 'Profile';
    const leaderboardBtnTxt = 'Leaderboard';

    const gameDescriptorTitle = 'Regular Wordle too easy? Want to play more than once a day?';
    const gameDescriptor1 = 'Upload your own word and pit yourself against the words of other Wordle enthusiasts. ';
    const gameDescriptor2 = 'Battle against others and see who can get the highest score!';
    const gameDescriptor3 = 'Bring a new word every day because the word pool resets daily!';

    const howToPlay = 'How to play';
    const howToPlayListDescList = [
        'Log in with an account', 
        'Visit your profile', 
        'Upload a 5 letter word', 
        'Press play to match against a random players word',
        'Win or lose points for words you solve and each player you beat with your word!'
    ]

    return (
        <>
            <img className={styles.logo} src={logoSrc} alt={"logo"} />
            <div className={styles.flex_container}>
                <div className={styles.buttonMenu}>
                    {isLoggedIn ? <></> : <Button btnText={loginBtnTxt} clickHandler={loginHandler} />}

                    {/* Temporary for testing, so we can access Game directly */}
                    <Button btnText={playBtnTxt} clickHandler={playBtnHandler} />
                    <Button btnText={profileBtnTxt} clickHandler={profileHandler} />
                    <Button btnText={leaderboardBtnTxt} clickHandler={leaderboardHandler} />

                    {isLoggedIn ? <Button btnText='Logout' clickHandler={logoutHandler} /> : <></>}
                </div>

                <div className={styles.game_descriptor}>
                    <h3 className={styles.desc_title}>{gameDescriptorTitle}</h3>
                    <p>{gameDescriptor1}<br />
                        {gameDescriptor2}<br />
                        {gameDescriptor3}
                    </p>
                </div>

                <div className={styles.how_to_div}>
                    <h3 className={styles.desc_title}>{howToPlay}</h3>
                    <ol className={styles.how_to}>
                        <li>{howToPlayListDescList[0]}</li>
                        <li>{howToPlayListDescList[1]}</li>
                        <li>{howToPlayListDescList[2]}</li>
                        <li>{howToPlayListDescList[3]}</li>
                        <li>{howToPlayListDescList[4]}</li>
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
    logoutHandler: PropTypes.func,
}

export default Homepage;