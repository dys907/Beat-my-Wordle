import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import {
    upload,
    helpModalTitleText,
    helpModalDescText,
    deleteWarning,
    deleteYourWordButtonText,
    submitButtonText,
    homeButtonText,
    playButtonText,
    profileText,
    incorrectLengthText,
    uploadErrorText,
    wordValidationErrorText,
    successfulDeleteText,
    errorWordDeleteText,
    connectErrorText,
} from './strings';
import PropTypes from 'prop-types';
import styles from './UploadPage.module.css';
import { SC } from '../../configs/httpResponseCodes';

const UploadPage = ({ homeHandler, playBtnHandler, setOwnWord, profileHandler }) => {
    const username = localStorage.getItem('username');
    const xhttp = new XMLHttpRequest();
    const endPointRoot = "https://wordle.itsvicly.com/";

    const [uploadStatus, setUploadStatus] = useState();
    const uploadWord = () => {
        const word = document.querySelector("#word").value;
        if (word.length !== 5) {
            setUploadStatus(incorrectLengthText);
            return;
        }

        checkIfWord(word).then((res) => {
            let isWord = JSON.parse(res).isWord;
            if (isWord) {
                checkIfHasWord().then((res2) => {
                    let currentWord = JSON.parse(res2).word;
                    const update = "update";
                    const upload = "upload";
                    let method = (currentWord === "") ? upload : update;
                    wordToDB(method, word).then(() => {
                        const uploadSuccessText = "Word - " + word + " was uploaded";
                        setUploadStatus(uploadSuccessText);
                        setOwnWord(word);
                    }).catch(() => {
                        setUploadStatus(uploadErrorText);
                    })
                })
            } else {
                const invalidWordText = word + " is not a valid word, try a different word";
                setUploadStatus(invalidWordText);
            }
        }).catch((err) => {
            setUploadStatus(wordValidationErrorText);
        })
    }

    const checkIfWord = (word) => {
        return new Promise((res, rej) => {
            const resourceGet = "1/words/check/?word=" + word;
            xhttp.open('GET', endPointRoot + resourceGet, true);
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"));
            xhttp.onload = () => {
                if (xhttp.status === SC.OK) {
                    res(xhttp.response);
                } else {
                    rej(xhttp.statusText);
                }
            }
            xhttp.send();
        })
    }

    const checkIfHasWord = () => {
        return new Promise((res, rej) => {
            const resourceGet = "1/words/?username=" + username;
            xhttp.open('GET', endPointRoot + resourceGet, true);
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"));
            xhttp.onload = () => {
                if (xhttp.status === SC.OK) {
                    res(xhttp.response);
                } else {
                    rej(xhttp.statusText);
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
            xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"));
            xhttp.onload = () => {
                if (xhttp.status === SC.OK) {
                    res(xhttp.response);
                } else {
                    rej(xhttp.statusText);
                }
            }
            xhttp.send(params);
        })
    }

    const deleteWord = () => {
        const resourceDelete = "1/words/?username=" + username;
        xhttp.open('DELETE', endPointRoot + resourceDelete, true);
        xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"));
        xhttp.onload = () => {
            if (xhttp.status === SC.OK) {
                setUploadStatus(successfulDeleteText);
                setOwnWord("");
            } else if (xhttp.status === SC.BAD_REQUEST) {
                setUploadStatus(errorWordDeleteText);
            } else {
                setUploadStatus(connectErrorText);
            }
        }
        xhttp.send();
    }

    return (
        <div>
            <h1 className={styles.title}>{upload}</h1>
            <div className={styles.upload_section}>
                <h2>{helpModalTitleText}</h2>
                <h4 className={styles.help_desc}>{helpModalDescText + deleteWarning}</h4>
                <div className={styles.upload}>
                    <input id="word" className={styles.word} type="text"></input>
                    <button onClick={() => uploadWord()}>{submitButtonText}</button>
                </div>

                <br></br>
                <div className={styles.delete}></div>
                <Button btnText={deleteYourWordButtonText} clickHandler={() => { deleteWord() }} />
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