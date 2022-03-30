import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

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

        <h1>Leaderboard</h1>

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




                    <Button btnText='Home' clickHandler={homeHandler} />
            
            <Button btnText='Play!' clickHandler={playBtnHandler} />
        
        </>
    );
}

Leaderboardpage.propTypes = {
    homeHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
    jsonList: PropTypes.string,
}

export default Leaderboardpage;