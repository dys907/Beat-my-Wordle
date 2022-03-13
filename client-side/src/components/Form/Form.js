import React, { useState } from 'react';
// import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Form = ({ titleTxt, isAdmin, submitTxt }) => {    
    const [user, setName] = useState('');
    const [pass, setPassword] = useState('');
    //login, adminStats, adminError
    const [pageFlow, setPageFlow] = useState('login');

    const handleChange = (event) => {
        if (event.target.name === 'username') { setName(event.target.value) }
        if (event.target.name === 'password') { setPassword(event.target.value) }
    }

    const handleSubmit = () => {
        const submitObject = {
            user: user,
            pass: pass
        }
        console.log('handle submit called');

        if (isAdmin) {
            const host = `http://localhost:8890`;
            const endpoint = `/adminLogin`;
            const URL = host + endpoint;
            console.log("HandleSubmit called");

            fetch(`${URL}/`, {
                method: 'POST',
                body: JSON.stringify(submitObject)
            }).then(function(response) {
                response.text().then((txt) => {
                    console.log(txt);
                    if (response.status !== 403) {
                        console.log('ayy admin');
                        setPageFlow('adminStats');
                    } else {
                        setPageFlow('adminError');
                    }
                });
            })
            .catch(err => { //On error
                console.log("Error caught: " + err);
            });
        }
    }
    
    return (
        pageFlow === 'login' ?
            <div>
                <h2>{titleTxt}</h2>
                <form onSubmit={handleSubmit} >
                    <label>
                        Username:
                        <input type="text" name="username" onChange={handleChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={handleChange} />
                    </label>
                    <input type="submit" value={submitTxt}  />
                </form>
                {pageFlow === 'adminError' ? <p>There was an error with your admin credentials. Try again.</p> : <></>}
            </div>
        :<></>
    );
};

Form.propTypes = {
    titleTxt: PropTypes.string,
    isAdmin: PropTypes.bool,
    submitTxt: PropTypes.string,
}

export default Form;