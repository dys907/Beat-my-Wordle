import React from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

const UploadPage = ({ homeHandler, playBtnHandler }) => {

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
            if (this.readyState == 4) {
                const response = this.responseText.toString();
                const resJSON = JSON.parse(response);
                if(this.status == 200) {
                    if (resJSON.isWord === true) {
                        const username = "Vicly"; // hardcoded, get username later
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
                                    formStatus.innerHTML = "Word - " + word + " was uploaded";
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
        <>
            <input id="word" type="text"></input>
            
            <Button btnText="Submit" clickHandler= {() => uploadWord()}></Button>

            <h3 id="status"></h3>

            <Button btnText='Home' clickHandler={homeHandler} />
            {/* Temporary for testing, so we can access Game directly */}
            <Button btnText='Play!' clickHandler={playBtnHandler} />
        </>
    );
}

UploadPage.propTypes = {
    pageFlow: PropTypes.string,
    loginHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
}

export default UploadPage;