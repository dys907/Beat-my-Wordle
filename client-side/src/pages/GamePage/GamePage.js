import React from "react";
import Game from "../../components/Game/Game";
import BackButton from "../../components/BackButton/BackButton";

const GamePage = ({homeHandler, word, opponent}) => {
    return (
        <>
            <BackButton clickHandler={homeHandler} />
            <Game word={word} opponent={opponent}/>
        </>
    )
}

export default GamePage;
