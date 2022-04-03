import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

import styles from './LeaderboardPage.module.css';

const Leaderboardpage = ({ homeHandler, playBtnHandler, jsonList }) => {
    const homeBtnTxt = 'Home';
    const playBtnTxt = 'Play!';

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
            <h1 className={styles.title}>Leaderboard</h1>
            <table id="leaderboard">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="list">
                </tbody>
            </table>
            <div className={styles.buttonMenu}>
                <Button btnText={homeBtnTxt} clickHandler={homeHandler} />
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