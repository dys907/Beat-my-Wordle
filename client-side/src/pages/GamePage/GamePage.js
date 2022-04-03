import React from "react";
import Game from "../../components/Game/Game";
import BackButton from "../../components/BackButton/BackButton";
import styles from './GamePage.module.css';

const GamePage = ({homeHandler, word, opponent}) => {
    return (
        <>  
            <div className={styles.buttonWrapper}>
                <BackButton clickHandler={homeHandler} />
            </div>
            <Game word={word} opponent={opponent}/>
        </>
    )
}

export default GamePage;
