import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

import styles from './UploadPage.module.css';

const UploadPage = ({ homeHandler, playBtnHandler, setOwnWord, profileHandler }) => {
    const username = sessionStorage.getItem('username')
    const upload = 'Edit your word';
    const helpModalTitleText = 'Upload a word or change your current one';
    const helpModalDescText = '* If you already uploaded a word, uploading a new one will overwrite it';
    const deleteWarning = 'If you delete your word you will not be able to play until you upload a new word!'
    const deleteYourWordButtonText = 'Delete your word';
    const submitButtonText = 'Submit';
    const homeButtonText = 'Home';
    const playButtonText = 'Play';
    const profileText = 'Profile';

    const xhttp = new XMLHttpRequest();
    const endPointRoot = "https://wordle.itsvicly.com/";

    const [uploadStatus, setUploadStatus] = useState();
    const uploadWord = () => {
        const incorrectLengthText = "Word is not of length 5, try a 5 letter word";
        const uploadErrorText = "Something went wrong, upload failed";
        const wordValidationErrorText = "Something went wrong with word validation";
        const word = document.querySelector("#word").value
        if (word.length !== 5) {
            setUploadStatus(incorrectLengthText);
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
                        setUploadStatus(uploadSuccessText)
                        setOwnWord(word);
                    }).catch(() => {
                        setUploadStatus(uploadErrorText)
                    })
                })
            } else {
                const invalidWordText = word + " is not a valid word, try a different word";
                setUploadStatus(invalidWordText)
            }
        }).catch((err) => {
            setUploadStatus(wordValidationErrorText)
        })
    }

    const checkIfWord = (word) => {
        return new Promise((res, rej) => {
            const resourceGet = "1/words/check/?word=" + word;
            xhttp.open('GET', endPointRoot + resourceGet, true);
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
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
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
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
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
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
        xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
        xhttp.onload = () => {
            if (xhttp.status === 200) {
                setUploadStatus(successfulDeleteText);
                setOwnWord("")
            } else if (xhttp.status === 400) {
                setUploadStatus(errorWordDeleteText)
            } else {
                setUploadStatus(connectErrorText)
            }
        }
        xhttp.send()
    }

    return (
        <div>
            <h1 className={styles.title}>{upload}</h1>

            <div className={styles.upload_section}>
                <h2>{helpModalTitleText}</h2>
                <h4 className={styles.help_desc}>{helpModalDescText}</h4>

                <div className={styles.upload}>
                    <input id="word" className={styles.word} type="text"></input>
                    <button onClick={() => uploadWord()}>{submitButtonText}</button>

                </div>

                <br></br>

                {/* <button onClick={() => deleteWord()}>{deleteYourWordButtonText}</button> */}
                <h4 className={styles.help_desc}>{deleteWarning}</h4>
                <div className={styles.delete}>

                </div>
                <Button btnText={deleteYourWordButtonText} clickHandler={() => { deleteWord() }} />
                {/* <Button btnText="Submit" clickHandler= {() => uploadWord()}></Button> */}

                <h3 id="status" className={styles.status}>{uploadStatus}</h3>

            </div>

            <div className={styles.buttonMenu}>
                <Button btnText={profileText} clickHandler={profileHandler} />
                <Button btnText={homeButtonText} clickHandler={homeHandler} />
                <Button btnText={playButtonText} clickHandler={playBtnHandler} />
            </div>

        </div>
    );
}

UploadPage.propTypes = {
    homeHandler: PropTypes.func,
    setOwnWord: PropTypes.func,
    playBtnHandler: PropTypes.func,
    profileHandler: PropTypes.func,
}

export default UploadPage;