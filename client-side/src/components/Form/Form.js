import React, { useState } from 'react';
// import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Form = ({ titleTxt, formType, submitTxt, postLoginHandler }) => {    
    const [user, setName] = useState('');
    const [pass, setPassword] = useState('');
    //login, adminStats, adminError
    const [pageFlow, setPageFlow] = useState('login');
    const [adminStats, setAdminStats] = useState(null);
    const host = `https://wordle.itsvicly.com`;
    // const host = `http://localhost:8080`;
    const method = 'POST';

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
            setPageFlow('loginError');
        }
    }

    const handleLogin = async () => {
        const endpoint = `/1/users/login`;
        const URL = host + endpoint;

        const response = await fetchMethod(method, URL);
        try {
            const data = await response.json();
            if (response.status === 403) {
                setPageFlow('loginError');
            } else {
                document.cookie = `token=${data}`;
                console.log(`Token received!: ${data}`);
                postLoginHandler();
            }
        } catch (e) {
            console.log('login error' + e);
        }
    }

    const handleSignup = async () => {
        const endpoint = `/1/users/signup`;
        const URL = host + endpoint;

        const response = await fetchMethod(method, URL);
        try {
            const data = await response.json();
            if (response.status === 403) {
                setPageFlow('loginError');
            } else {
                // document.cookie = `token=${data}`;
                console.log(`Signup successful!`);
                postLoginHandler();
            }
        } catch (e) {
            console.log('login error' + e);
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
    
    return (
        pageFlow === 'login' || pageFlow ==='loginError' ?
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
                {pageFlow === 'loginError' ? <p>There was an error with your login credentials. Try again.</p> : <></>}
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