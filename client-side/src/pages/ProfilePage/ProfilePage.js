import React from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

import styles from './ProfilePage.module.css';

const ProfilePage = ({ homeHandler, playBtnHandler, score, ownWord, setOwnWord }) => {
    const username = sessionStorage.getItem('username') // fix later
    // todo: change/delete instead of upload once a word already uploaded
    const uploadWord = () => {
        const word = document.querySelector("#word").value
        const formStatus = document.querySelector("#status");
        if (word.length != 5) {
            formStatus.innerHTML = "Word is not of length 5, try a 5 letter word"
            return;
        }
        const xhttp = new XMLHttpRequest();
        const endPointRoot = "https://wordle.itsvicly.com/";
        const resourceGet = "1/words/check/?word=" + word;
        const resourcePost = "1/words/upload";
        xhttp.open('GET', endPointRoot + resourceGet, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = this.responseText.toString();
                console.log(response)
                const resJSON = JSON.parse(response);
                if(this.status == 200) {
                    if (resJSON.isWord === true) {
                        const jsonObj = {
                            username: username,
                            word: word
                        }
                        const params = JSON.stringify(jsonObj);
                        xhttp.open('PUT',endPointRoot + resourcePost, true);
                        xhttp.setRequestHeader("Content-type","application/json");
                        xhttp.send(params);
                        xhttp.onreadystatechange = function(){
                            if (this.readyState == 4) {
                                if(this.status == 200) {
                                    formStatus.innerHTML = "Word - " + word + " was " + this.responseText;
                                    setOwnWord(word)
                                } else if (this.status == 400) {
                                    formStatus.innerHTML = "Something went wrong, upload failed";
                                }
                            }
                        }
                    } else {
                        formStatus.innerHTML = word + " is not a valid word, try a different word"
                    }
                } else {
                    formStatus.innerHTML = "Something went wrong with word validation";
                }
            }
        }
    

    
    }

    return (
        <div>
            <div  className={styles.profile_card}>
            <h1>Username</h1>
            <span>{username}</span>

            <h1>Rating</h1>
            <span>{score}</span>

            <h1>Your word</h1>
            <span>{ownWord? ownWord : "NONE!"}</span>
            </div>

            <div className={styles.upload_section}>

            <h2>Upload / update your word</h2>

            <h4>* If you already uploaded a word, uploading a new one will overwrite it</h4>

            <input className={styles.word} type="text"></input>

            <button onClick={() => uploadWord()}>Submit</button>
            
            {/* <Button btnText="Submit" clickHandler= {() => uploadWord()}></Button> */}

            <h3 className={styles.status}></h3>
            </div>



            <Button btnText='Home' clickHandler={homeHandler} />

            <Button btnText='Play!' clickHandler={playBtnHandler} />
        </div>
    );
}

ProfilePage.propTypes = {
    homeHandler: PropTypes.func,
    loginHandler: PropTypes.func,
    score: PropTypes.number,
    ownWord: PropTypes.string,
    setOwnWord: PropTypes.func,
}

export default ProfilePage;