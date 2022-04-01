import React, { Component, useEffect, useState } from 'react';
import $ from 'jquery';
import './Game.css';
import CustomModal from '../CustomModal/CustomModal'

const Game = ({ word, gameResult, opponent }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalText, setModalText] = useState("")
    useEffect(() => {

        const username = sessionStorage.getItem('username'); // todo: fix this later

        const xhttp = new XMLHttpRequest();
        const endPointRoot = "https://wordle.itsvicly.com/";
        gameResult(0)
        const CODE_A = 65;
        const CODE_a = 97;
        const CODE_z = 122;
        const NUMBER_OF_LETTERS = 5;
        const MAX_GUESS = 6;
        const LETTERS_KEYBOARD_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
        const LETTERS_KEYBOARD_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
        const LETTERS_KEYBOARD_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
        const ENTER_KEY = 13;
        const DELETE_KEY = 8;
        
        
        let won = false;
        let lost = false;
        
        let solution = word.toUpperCase();
        console.log(solution);
        
        let solutionArrary = [];
        
        for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
            solutionArrary.push(solution.substring(i, i + 1));
        }

        console.log(solutionArrary)
        
        
        let guessCounter = 0;
        let letterCounter = 0;
        let currentGuess = [];
        let guessArray = [];
        let letterArray = [];
        
        function Guess(number) {
            this.number = number;
            this.letters = [];
            this.element = $("<div></div>");
            for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
                this.letters.push(new Letter(i, this.element));
            }
            $("#guessDiv").append(this.element);
        }
        
        function Letter(index, parent) {
            this.letter = "";
            this.index = index;
            this.setLetter = (letter) => {
                this.letter = letter;
                this.text.html(letter);
            }
            this.clearLetter = () => {
                this.letter = "*";
                this.text.html("*");
            }
            this.text = $("<div><span>*</span></div>").addClass("letterClass");//.css({"color": "white", "display":"inline-block", "width": "10vw", "height": "5vh", "border": "2px dashed white"});
            this.setColor = (color) => {
                $(this.text).css("backgroundColor", color);
            }
            parent.append(this.text);
        }
        
        function LetterBtn(letter, row) {
            this.index = letter.charCodeAt() - CODE_A;
            this.letter = letter;
            this.row = row;
            this.alreadyGreen = false;
            this.btn = $("<button class='letter'></button>").addClass("letterBtnClass")//css({"width": "5vw", "height": "5vh", "backgroundColor": "white", "border-radius": "5px"})
            .append(letter).click(() => {
                pressLetter(letter);
            });
            this.setColor = (color) => {
                this.btn.css("backgroundColor", color);
            }
            $("#letterDiv").append(this.btn);
        }
        
        $(document).on('keypress', (e) => {
            if (e.which === ENTER_KEY) {
                e.preventDefault();
                pressEnter();
            } else if (e.which <= CODE_z && e.which >= CODE_a) {
                pressLetter(String.fromCharCode(e.which).toUpperCase());
            }
        }).on('keydown', (e) => {
            if (e.which === DELETE_KEY) {
                pressDelete();
            }
        })
        
        for (let i = 0; i < MAX_GUESS; i++) {
            let newGuess = new Guess(i);
            guessArray.push(newGuess);
            $("body").append(newGuess);
        }
        
        LETTERS_KEYBOARD_1.forEach((el) => {
            let newLetter = new LetterBtn(el);
            letterArray.push(newLetter);
        })
        
        $("#letterDiv").append($("<br>"));
        
        LETTERS_KEYBOARD_2.forEach((el) => {
            let newLetter = new LetterBtn(el);
            letterArray.push(newLetter);
        })
        
        $("#letterDiv").append($("<br>"));

        let enter_btn = $("<button></button>").append("ENTER").addClass("enter_delete").click(() => {
            pressEnter();
        })
        $("#letterDiv").append(enter_btn);


        LETTERS_KEYBOARD_3.forEach((el) => {
            let newLetter = new LetterBtn(el);
            letterArray.push(newLetter);
        })
        

        
        let del_btn = $("<button></button>").append("DEL").addClass("enter_delete").click(() => {
            pressDelete();
        })
        $("#letterDiv").append(del_btn);
        
        function pressEnter() {
            if (letterCounter === NUMBER_OF_LETTERS && guessCounter < MAX_GUESS && !won && !lost) {
                let currentGuessWord = "";

                currentGuess.forEach((letter) => {
                    currentGuessWord += letter;
                })

                checkIsWord(currentGuessWord).then((res) => {
                    const resJSON = JSON.parse(res)
                    if (resJSON.isWord === true) {
                        let equal = [];
                        solutionArrary.forEach((el, index) => {
                            (el === currentGuess[index]) ? equal.push(1) : equal.push(0);
                        })
                        let sum = 0;
                        equal.forEach((el, index) => {
                            sum += el;
                            if (el === 0) {
                                let existElsewhere = solutionArrary.some((element) => {
                                    return currentGuess[index] === element
                                })
                                if (existElsewhere) {
                                    letterArray.forEach((el) => {
                                        if (el.letter === currentGuess[index] && !el.alreadyGreen) el.setColor("#FADA5E");
                                    })
                                    guessArray[guessCounter].letters[index].setColor("#FADA5E");
                                } else {
                                    letterArray.forEach((el) => {
                                        if (el.letter === currentGuess[index] && !el.alreadyGreen) el.setColor("#626262");
                                    })
                                    guessArray[guessCounter].letters[index].setColor("#626262");
                                }
                            } else {
                                letterArray.forEach((el) => {
                                    if (el.letter === currentGuess[index]) {
                                        el.setColor("green");
                                        el.alreadyGreen = true;
                                    }
                                })
                                guessArray[guessCounter].letters[index].setColor("green");
                            }
                        })
                        if (sum === NUMBER_OF_LETTERS) {
                            won = true;
                            gameResult(MAX_GUESS - guessCounter + 1);
                            updateScore(MAX_GUESS - guessCounter + 1)
                        }
                        currentGuess = [];
                        guessCounter++;
                        letterCounter = 0;
                        if (guessCounter == MAX_GUESS && !won) {
                            lost = true;
                            gameResult(-1);
                            updateScore(-1);
                        }
                        
                    } else {
                        setModalTitle(currentGuessWord + " is not a word!")
                        setModalText("Try another word!");//todo: css this
                        setModalOpen(true)
                    }
                })





            }
        }

        function checkIsWord(currentGuessWord) {
            const resourceGet = "1/words/check/?word=" + currentGuessWord;
            return new Promise((res, rej) => {
                xhttp.open("GET", endPointRoot + resourceGet, true);
                xhttp.onload = () => {
                    if (xhttp.status === 200) {
                        res(xhttp.response)
                    } else {
                        rej(xhttp.statusText)
                    }
                }
                xhttp.send();
            })
            
        }
        
        function pressDelete() {
            if (letterCounter > 0 && guessCounter < MAX_GUESS && !won && !lost) {
                letterCounter--;
                guessArray[guessCounter].letters[letterCounter].clearLetter();
                currentGuess.pop();
            }
        }
        
        function pressLetter(letter) {
            if (letterCounter < NUMBER_OF_LETTERS && !won && !lost) {
                guessArray[guessCounter].letters[letterCounter].setLetter(letter);
                letterCounter++;
                currentGuess.push(letter);
            }
        }

        function updateScore(s) {
            const score_offset = 5;
            const resJSON = {
                username: username,
                score: s
            }
            const resJSONOpponent = {
                username: opponent,
                score: (score_offset - s)
            }
            updateUser(resJSON).then(() => {
                updateUser(resJSONOpponent).then(() => {
                    let scoreTitle = s > 0 ? "Congrats!" : "Oops, the word is " + word
                    let scoreText = s > 0 ? "You solved the wordle and gained " + s + " points!" : "Better luck next time!"
                    setModalText(scoreText)
                    setModalTitle(scoreTitle)
                    setModalOpen(true)
                })
            })
        }

        function updateUser(resJSON) {
            
            const resourceUpdate = "1/scores";
            return new Promise((res, rej) => {
                const resStr = JSON.stringify(resJSON);
                xhttp.open("POST", endPointRoot + resourceUpdate, true);
                xhttp.setRequestHeader("Content-type","application/json");
                xhttp.onload = () => {
                    if (xhttp.status === 200) {
                        res(xhttp.response)
                    } else {
                        rej(xhttp.statusText)
                    }
                }
                xhttp.send(resStr);
            })
            
        }


    }, [])
    return (
        <>
                <div className="Game">
          <h1 id="head">Wordle</h1>
          <div id="guessDiv"></div>
          <div id="letterDiv"></div>
        </div>
        <CustomModal openModal={modalOpen} title={modalTitle} text={modalText} handleOpen={setModalOpen}/>
        </>

      );
}

  
export default Game;