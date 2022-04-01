import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

import styles from './ProfilePage.module.css';

const ProfilePage = ({ homeHandler, playBtnHandler, score, ownWord, setOwnWord }) => {
    const username = sessionStorage.getItem('username')
    console.log(username)
    // shows the upload menu underneath
    const [visible, setVisible] = useState(false);
    const toggleUpload = () => {
        setVisible(!visible);
    }

    const xhttp = new XMLHttpRequest();
    const endPointRoot = "https://wordle.itsvicly.com/";
    const formStatus = document.querySelector("#status");
    // todo: change/delete instead of upload once a word already uploaded
    const uploadWord = () => {
        console.log("HELLo")
        const word = document.querySelector("#word").value
        if (word.length != 5) {
            formStatus.innerHTML = "Word is not of length 5, try a 5 letter word"
            return;
        }
        const resourceGet = "1/words/check/?word=" + word;
        const resourcePost = "1/words/upload";
        xhttp.open('GET', endPointRoot + resourceGet, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = this.responseText.toString();
                console.log(response)
                const resJSON = JSON.parse(response);
                if (this.status == 200) {
                    if (resJSON.isWord === true) {
                        const jsonObj = {
                            username: username,
                            word: word
                        }
                        const params = JSON.stringify(jsonObj);
                        xhttp.open('PUT', endPointRoot + resourcePost, true);
                        xhttp.setRequestHeader("Content-type", "application/json");
                        xhttp.send(params);
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                if (this.status == 200) {
                                    formStatus.innerHTML = "Word - " + word + " was uploaded";
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

    const deleteWord = () => {
        const resourceDelete = "1/words/?username=" + username;
        xhttp.open('DELETE', endPointRoot + resourceDelete, true)
        xhttp.send()
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    formStatus.innerHTML = "Your word has been deleted"
                    setOwnWord("")
                } else if (this.status === 400) {
                    formStatus.innerHTML = "You did not have a word uploaded"
                } else {
                    formStatus.innerHTML = "Error connecting to the server"
                }
            }
        }
    }

    return (
        <div>
            <div className={visible ? styles.hide_display: styles.profile_card}>
                <div className={styles.inner_profile}>
                    <div className={styles.userName}>
                        <span>{username}</span>
                    </div>
                    <h1>Rating</h1>
                    <div className={styles.cardBox}>
                        <span>{score}</span>
                    </div>

                    <h1>Word</h1>
                    <div className={styles.cardBox}>
                        <span>{ownWord ? ownWord : "NONE!"}</span>
                    </div>
                </div>
                <Button btnText='Change Word' clickHandler={() => { toggleUpload() }} />
            </div>

            <div className={visible ? styles.upload_section : styles.hide_display}>

                <h2>Upload a word or change your current one</h2>

                <h4>* If you already uploaded a word, uploading a new one will overwrite it</h4>

                <input id="word" className={styles.word} type="text"></input>

                <button onClick={() => uploadWord()}>Submit</button>

                <br></br>

                <button onClick={() => deleteWord()}>Delete your word</button>

                {/* <Button btnText="Submit" clickHandler= {() => uploadWord()}></Button> */}

                <h3 id="status" className={styles.status}></h3>
                <Button btnText='View Info' clickHandler={() => { toggleUpload() }} />
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