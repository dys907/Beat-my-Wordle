import React from "react";
import Game from "../../components/Game/Game";
import BackButton from "../../components/BackButton/BackButton";

const GamePage = ({homeHandler, word, gameResult, opponent}) => {
    return (
        <>
            <BackButton clickHandler={homeHandler} />
            <Game word={word} gameResult={gameResult} opponent={opponent}/>
        </>
    )
}

export default GamePage;
