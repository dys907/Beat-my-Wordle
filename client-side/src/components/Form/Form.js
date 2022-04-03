import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../Button/Button.module.css';
import formStyles from './Form.module.css';

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

    const userNameLabel = 'Username: ';
    const passwordLabel = 'Password: ';
    const loginErrorText = 'There was an error with your login credentials. Please try again.';
    const signupErrorText = 'That username is already taken.';
    const generalErrorText = 'There was an error with our servers. Please try again later!';

    const handleChange = (event) => {
        if (event.target.name === 'username') { setName(event.target.value) }
        if (event.target.name === 'password') { setPassword(event.target.value) }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('handle submit called');
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
        const endpoint = `/1/users/admin/login`;
        const URL = host + endpoint;
        
        const response = await fetchMethod(method, URL);
        try {
            
            const data = await response.json();
            setAdminStats(data);
            setPageFlow('adminStats');
        } catch {
            console.log('error');
            setErrorMsgAndChangePageFlow(loginErrorText);
        }
    }

    const handleLogin = async () => {
        const endpoint = `/1/users/login`;
        const URL = host + endpoint;        
        try {
            const response = await fetchMethod(method, URL);
            if (response.status !== 200) {
                setErrorMsgAndChangePageFlow(loginErrorText);
                response.text().then(text => {
                    console.log(text);
                });
            } else {
                console.log(`Login successful!`);
                response.text().then(text => {
                    let jwt_token = JSON.parse(text).access_token;
                    localStorage.setItem("jwt", jwt_token);
                })
                postLoginHandler(user);
            }
        } catch (e) {
            setErrorMsgAndChangePageFlow(generalErrorText);
            console.log('login error' + e);
        }
    }

    const handleSignup = async () => {
        const endpoint = `/1/users/signup`;
        const URL = host + endpoint;
        try {
            const response = await fetchMethod(method, URL);
            if (response.status !== 200) {
                setErrorMsgAndChangePageFlow(generalErrorText);
                response.text().then(text => {
                    console.log(text);
                });
                console.log(response);
            } else {
                console.log(`Signup successful!`);
                response.text().then(text => {
                    console.log(text);
                    let jwt_token = JSON.parse(text).access_token;
                    localStorage.setItem("jwt", jwt_token);
                })
                postLoginHandler(user);
            }
        } catch (e) {
            setErrorMsgAndChangePageFlow(signupErrorText);
            console.log('signup error ' + e);
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
         <>
            <h3>Admin stats</h3>
            <h3>Get stats</h3>
            {adminStats && 
                Object.keys(adminStats["GET"]).map((key, i) => (
                <p key={key}>Endpoint= {key}: {adminStats["GET"][key]} hits</p>
            )) }
            <h3>Post stats</h3>
            {adminStats && 
                Object.keys(adminStats["POST"]).map((key, i) => (
                <p key={key}>Endpoint= {key}: {adminStats["POST"][key]} hits</p>
            )) }
            <h3>Delete stats</h3>
            {adminStats && 
                Object.keys(adminStats["DELETE"]).map((key, i) => (
                <p key={key}>Endpoint= {key}: {adminStats["DELETE"][key]} hits</p>
            )) }
            <h3>Put stats</h3>
            {adminStats && 
                Object.keys(adminStats["PUT"]).map((key, i) => (
                <p key={key}>Endpoint= {key}: {adminStats["PUT"][key]} hits</p>
            )) }
        </>
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