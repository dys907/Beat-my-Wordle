import React, { useEffect } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import Button from '../../components/Button/Button';
import {
    playBtnTxt,
    leaderBoardTitle,
    rankHeader,
    usernameHeader,
    scoreHeader,
} from './strings';
import PropTypes from 'prop-types';

import styles from './LeaderboardPage.module.css';

const Leaderboardpage = ({ homeHandler, playBtnHandler, jsonList }) => {
    useEffect(() => {
        const list = JSON.parse(jsonList);
        let listDiv = document.querySelector("#list");
        list.forEach((element, index) => {
            let newEntry = document.createElement("tr");
            let newRank = document.createElement("td");
            newRank.innerHTML = index + 1;
            let newUsername = document.createElement("td");
            newUsername.innerHTML = element.username;
            let newScore = document.createElement("td");
            newScore.innerHTML = element.score;
            newEntry.appendChild(newRank)
            newEntry.appendChild(newUsername)
            newEntry.appendChild(newScore)
            listDiv.appendChild(newEntry);
        })
    }, [])

    return (
        <>
            <div className={styles.backWrapper}>
                <BackButton clickHandler={homeHandler} />
            </div>
            <h1 className={styles.title}>{leaderBoardTitle}</h1>
            <table id="leaderboard" className={styles.leaderboard}>
                <thead>
                    <tr>
                        <th>{rankHeader}</th>
                        <th>{usernameHeader}</th>
                        <th>{scoreHeader}</th>
                    </tr>
                </thead>
                <tbody id="list">
                </tbody>
            </table>
            <div className={styles.buttonMenu}>
                <Button btnText={playBtnTxt} clickHandler={playBtnHandler} />
            </div>
        </>
    );
}

Leaderboardpage.propTypes = {
    homeHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
    jsonList: PropTypes.string,
}

export default Leaderboardpage;