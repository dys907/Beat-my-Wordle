import { Component } from "react";
import Game from "../../components/Game/Game";
import Button from '../../components/Button/Button';

const GamePage = ({homeHandler, word, gameResult}) => {
    return (
        <><Game word={word} gameResult={gameResult}/>
        <Button btnText='Home' clickHandler={homeHandler} />
        </>

    )
}

export default GamePage;
