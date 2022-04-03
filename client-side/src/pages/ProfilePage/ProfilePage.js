import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

import styles from './ProfilePage.module.css';

const ProfilePage = ({ homeHandler, playBtnHandler, score, ownWord, setOwnWord }) => {
    const username = sessionStorage.getItem('username')
    const changeWordButtonText = 'Change Word';
    const noWordText = 'NONE!';
    const helpModalTitleText = 'Upload a word or change your current one';
    const helpModalDescText = '* If you already uploaded a word, uploading a new one will overwrite it';
    const deleteYourWordButtonText = 'Delete your word';
    const submitButtonText = 'Submit';
    const viewInfoButtonText = 'View Info';
    const homeButtonText = 'Home';
    const playButtonText = 'Play';

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
        const incorrectLengthText = "Word is not of length 5, try a 5 letter word";
        const uploadErrorText = "Something went wrong, upload failed";
        const wordValidationErrorText = "Something went wrong with word validation";
        const word = document.querySelector("#word").value
        if (word.length !== 5) {
            formStatus.innerHTML = incorrectLengthText;
            return;
        }


        checkIfWord(word).then((res) => {
            let isWord = JSON.parse(res).isWord;
            if (isWord) {
                checkIfHasWord().then((res2) => {
                    let currentWord = JSON.parse(res2).word;
                    const update = "update"
                    const upload = "upload"
                    let method = (currentWord === "") ? upload : update;
                    wordToDB(method, word).then(() => {
                        const uploadSuccessText = "Word - " + word + " was uploaded";
                        formStatus.innerHTML = uploadSuccessText;
                        setOwnWord(word);
                    }).catch(() => {
                        formStatus.innerHTML = uploadErrorText;
                    })
                })
            } else {
                const invalidWordText = word + " is not a valid word, try a different word";
                formStatus.innerHTML = invalidWordText;
            }
        }).catch((err) => {
            formStatus.innerHTML = wordValidationErrorText;
        })
    }

    const checkIfWord = (word) => {
        return new Promise((res, rej) => {
            const resourceGet = "1/words/check/?word=" + word;
            xhttp.open('GET', endPointRoot + resourceGet, true);
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

    const checkIfHasWord = () => {
        return new Promise((res, rej) => {
            const resourceGet = "1/words/?username=" + username;
            xhttp.open('GET', endPointRoot + resourceGet, true);
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

    const wordToDB = (method, word) => {
        return new Promise((res, rej) => {
            const jsonObj = {
                username: username,
                word: word
            }
            const params = JSON.stringify(jsonObj);
            const resourcePost = "1/words/" + method;
            xhttp.open('PUT', endPointRoot + resourcePost, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    res(xhttp.response)
                } else {
                    rej(xhttp.statusText)
                }
            }
            xhttp.send(params);
        })
    }

    const deleteWord = () => {
        const successfulDeleteText = "Your word has been deleted";
        const errorWordDeleteText = "You did not have a word uploaded";
        const connectErrorText = "Error connecting to the server";
        const resourceDelete = "1/words/?username=" + username;
        
        xhttp.open('DELETE', endPointRoot + resourceDelete, true)
        xhttp.send()
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    formStatus.innerHTML = successfulDeleteText;
                    setOwnWord("")
                } else if (this.status === 400) {
                    formStatus.innerHTML = errorWordDeleteText;
                } else {
                    formStatus.innerHTML = connectErrorText;
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
                        <span>{ownWord ? ownWord : noWordText}</span>
                    </div>
                </div>
                <Button btnText={changeWordButtonText} clickHandler={() => { toggleUpload() }} />
            </div>

            <div className={visible ? styles.upload_section : styles.hide_display}>
                <h2>{helpModalTitleText}</h2>
                <h4>{helpModalDescText}</h4>

                <input id="word" className={styles.word} type="text"></input>
                <button onClick={() => uploadWord()}>{submitButtonText}</button>

                <br></br>

                <button onClick={() => deleteWord()}>{deleteYourWordButtonText}</button>
                {/* <Button btnText="Submit" clickHandler= {() => uploadWord()}></Button> */}

                <h3 id="status" className={styles.status}></h3>
                <Button btnText={viewInfoButtonText} clickHandler={() => { toggleUpload() }} />
            </div>

            <Button btnText={homeButtonText} clickHandler={homeHandler} />
            <Button btnText={playButtonText} clickHandler={playBtnHandler} />
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