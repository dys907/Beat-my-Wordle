import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    userNameLabel,
    passwordLabel,
    loginErrorText,
    signupErrorText,
    generalErrorText,
    adminStatsTxt,
    getStatsTxt,
    postStatsTxt,
    deleteStatsTxt,
    putStatsTxt,
    methodTxt,
    endpointTxt,
    requestsTxt,
    GET,
    POST,
    PUT,
    DELETE
} from './strings';
import styles from '../Button/Button.module.css';
import formStyles from './Form.module.css';
import { SC } from '../../configs/httpResponseCodes';

const Form = ({ titleTxt, formType, submitTxt, postLoginHandler }) => {    
    const [user, setName] = useState('');
    const [pass, setPassword] = useState('');
    //login, adminStats, adminError
    const [pageFlow, setPageFlow] = useState('login');
    const [adminStats, setAdminStats] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const host = `https://wordle.itsvicly.com`;
    //const host = `http://localhost:8080`;
    const method = 'POST';

    const handleChange = (event) => {
        if (event.target.name === 'username') { setName(event.target.value) }
        if (event.target.name === 'password') { setPassword(event.target.value) }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendFormData();
    }

    const sendFormData = async () => {
        if (formType === 'admin') {
            handleAdminLogin();
        } else if (formType === 'login') {
            handleLogin();
        } else {
            handleSignup();
        }
    }

    const handleAdminLogin =  async () => {
        const endpoint = `/1/users/adminLogin`;
        const URL = host + endpoint;
        
        const response = await fetchMethod(method, URL);
        try {
            const data = await response.json();
            setAdminStats(data);
            setPageFlow('adminStats');
        } catch {
            setErrorMsgAndChangePageFlow(loginErrorText);
        }
    }

    const handleLogin = async () => {
        const endpoint = `/1/users/login`;
        const URL = host + endpoint;        
        try {
            const response = await fetchMethod(method, URL);
            if (response.status !== SC.OK) {
                setErrorMsgAndChangePageFlow(loginErrorText);
            } else {
                response.text().then(text => {
                    let jwt_token = JSON.parse(text).access_token;
                    localStorage.setItem("jwt", jwt_token);
                })
                postLoginHandler(user);
            }
        } catch (e) {
            setErrorMsgAndChangePageFlow(generalErrorText);
        }
    }

    const handleSignup = async () => {
        const endpoint = `/1/users/signup`;
        const URL = host + endpoint;
        try {
            const response = await fetchMethod(method, URL);
            if (response.status !== SC.OK) {
                setErrorMsgAndChangePageFlow(generalErrorText);
            } else {
                response.text().then(text => {
                    let jwt_token = JSON.parse(text).access_token;
                    localStorage.setItem("jwt", jwt_token);
                })
                postLoginHandler(user);
            }
        } catch (e) {
            setErrorMsgAndChangePageFlow(signupErrorText);
        }
    }

    const fetchMethod = async (method, URL) => {
        const submitObject = {
            username: user,
            password: pass
        }
        return await fetch(`${URL}/`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(submitObject),
        });
    } 

    const setErrorMsgAndChangePageFlow = (msg) => {
        setErrorMsg(msg);
        setPageFlow('loginError');
    }
    
    return (
        pageFlow === 'login' || pageFlow ==='loginError' ?
            <div className={formStyles.wrapper}>
                <h2>{titleTxt}</h2>
                <form onSubmit={handleSubmit} >
                    <label className={formStyles.label}>
                        {userNameLabel} 
                        <input className={formStyles.input} type="text" name="username" onChange={handleChange} />
                    </label>
                    <label className={formStyles.label}>
                        {passwordLabel} 
                        <input className={formStyles.input}  type="password" name="password" onChange={handleChange} />
                    </label>
                    <input className={`${styles.defaultButton} ${formStyles.submitBtn}`} type="submit" value={submitTxt}  />
                </form>
                {pageFlow === 'loginError' ? <p>{errorMsg}</p> : <></>}
            </div>
        :pageFlow === 'adminStats' ?
         <div className={formStyles.adminWrapper}>
            <h3>{adminStatsTxt}</h3>
            <table className={formStyles.adminTable}>
                <thead>
                    <tr>
                        <th>{methodTxt}</th>
                        <th>{endpointTxt}</th>
                        <th>{requestsTxt}</th>
                    </tr>
                </thead>
                <tbody>

                
                {adminStats && 
                    Object.keys(adminStats["GET"]).map((key, i) => (
                        <tr>
                            <td>{GET}</td>
                            <td>{key}</td>
                            <td>{adminStats["GET"][key]}</td>
                        </tr>
                    )) 
                }
                {adminStats && 
                    Object.keys(adminStats["POST"]).map((key, i) => (
                        <tr>
                            <td>{POST}</td>
                            <td>{key}</td>
                            <td>{adminStats["POST"][key]}</td>
                        </tr>
                    )) 
                }

                {adminStats && 
                    Object.keys(adminStats["DELETE"]).map((key, i) => (
                        <tr>
                            <td>{DELETE}</td>
                            <td>{key}</td>
                            <td>{adminStats["DELETE"][key]}</td>
                        </tr>
                    )) 
                }

                {adminStats && 
                    Object.keys(adminStats["PUT"]).map((key, i) => (
                        <tr>
                            <td>{PUT}</td>
                            <td>{key}</td>
                            <td>{adminStats["PUT"][key]} </td>
                        </tr>
                )) }
                </tbody>
            </table>            
        </div>
        :<></>
    );
};

Form.propTypes = {
    titleTxt: PropTypes.string,
    formType: PropTypes.string,
    submitTxt: PropTypes.string,
    postLoginHandler: PropTypes.func
}

export default Form;