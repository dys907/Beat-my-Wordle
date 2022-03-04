import React, { Component } from 'react';
import $ from 'jquery';
import './Game.css';

class Game extends Component {
    componentDidMount() {
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
        
        let solution = "DIARY";
        
        let solutionArrary = [];
        
        for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
            solutionArrary.push(solution.substring(i, i + 1));
        }
        
        
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
        
        LETTERS_KEYBOARD_3.forEach((el) => {
            let newLetter = new LetterBtn(el);
            letterArray.push(newLetter);
        })
        
        $("#letterDiv").append($("<br>"));
        
        let enter_btn = $("<button></button>").append("ENTER").addClass("enter_delete").click(() => {
            pressEnter();
        })
        $("#letterDiv").append(enter_btn);
        
        let del_btn = $("<button></button>").append("DELETE").addClass("enter_delete").click(() => {
            pressDelete();
        })
        $("#letterDiv").append(del_btn);
        
        function pressEnter() {
            if (letterCounter === NUMBER_OF_LETTERS && guessCounter < MAX_GUESS && !won) {
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
                                if (el.letter === currentGuess[index] && !el.alreadyGreen) el.setColor("orange");
                            })
                            guessArray[guessCounter].letters[index].setColor("orange");
                        } else {
                            letterArray.forEach((el) => {
                                if (el.letter === currentGuess[index] && !el.alreadyGreen) el.setColor("red");
                            })
                            guessArray[guessCounter].letters[index].setColor("red");
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
                if (sum === NUMBER_OF_LETTERS) won = true;
                currentGuess = [];
                guessCounter++;
                letterCounter = 0;
            }
        }
        
        function pressDelete() {
            if (letterCounter > 0 && guessCounter < MAX_GUESS && !won) {
                letterCounter--;
                guessArray[guessCounter].letters[letterCounter].clearLetter();
                currentGuess.pop();
            }
        }
        
        function pressLetter(letter) {
            if (letterCounter < NUMBER_OF_LETTERS && !won) {
                guessArray[guessCounter].letters[letterCounter].setLetter(letter);
                letterCounter++;
                currentGuess.push(letter);
            }
        }
    }
    render() {
        return (
            <div className="Game">
              <h1 id="head">Wordle</h1>
              <div id="guessDiv"></div>
              <div id="letterDiv"></div>
            </div>
          );
    }

  }
  
  export default Game;