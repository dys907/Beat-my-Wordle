import React from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

const UploadPage = ({ homeHandler, playBtnHandler }) => {

    const uploadWord = (word) => {
        const formStatus = document.querySelector("#status");
        const xhttp = new XMLHttpRequest();
        const endPointRoot = "https://wordle.keyuka.ca/";
        const resourceGet = "words/check/?word=" + word;
        const resourcePost = "words/upload";
        xhttp.open('GET', resourceGet, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                const response = this.responseText.toString();
                const resJSON = JSON.parse(response);
                if(this.status == 200) {
                    if (resJSON.isWord === "True") {
                        const username = "Vicly"; // hardcoded, get username later
                        const jsonObj = {
                            username: username,
                            word: word
                        }
                        const params = JSON.stringify(jsonObj);
                        xhttp.open('POST',endPointRoot + resourcePost, true);
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
                    list.innerHTML = "Something went wrong with word validation";
                }
            }
        }
    

    
    }

    return (
        <>
            <input id="word" type="text"></input>
            
            <Button btnText="Submit" clickHandler= {() => uploadWord(document.querySelector("#word").value)}></Button>

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

export default Homepage;