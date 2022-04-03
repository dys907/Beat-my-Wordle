import React from 'react';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';
import {
    profile,
    scoreText,
    word,
    noWordText,
    editWord,
    playButtonText,
} from './strings';
import PropTypes from 'prop-types';

import styles from './ProfilePage.module.css';

const ProfilePage = ({ homeHandler, playBtnHandler, score, ownWord, uploadHandler }) => {
    const username = localStorage.getItem('username')

    return (
        <div>
            <div className={styles.backWrapper}>
                <BackButton clickHandler={homeHandler} />
            </div>
            
            <h1 className={styles.title}>{profile}</h1>
            <div className={styles.profile_card}>
                <div className={styles.inner_profile}>
                    <div className={styles.userName}>
                        <span>{username}</span>
                    </div>
                    <h1>{scoreText}</h1>
                    <div className={styles.cardBox}>
                        <span>{score}</span>
                    </div>

                    <h1>{word}</h1>
                    <div className={styles.cardBox}>
                        <span>{ownWord ? ownWord.toUpperCase() : noWordText}</span>
                    </div>
                </div>
            </div>

            <div className={styles.buttonMenu}>
                <Button btnText={editWord} clickHandler={uploadHandler} />
                <Button btnText={playButtonText} clickHandler={playBtnHandler} />
            </div>

        </div>
    );
}

ProfilePage.propTypes = {
    homeHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
    uploadHandler: PropTypes.func,
    score: PropTypes.number,
    ownWord: PropTypes.string,
}

export default ProfilePage;