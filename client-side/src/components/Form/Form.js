import React, { useState } from 'react';
// import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Form = ({ titleTxt, isAdmin, submitTxt }) => {    
    const [user, setName] = useState('');
    const [pass, setPassword] = useState('');
    //login, adminStats, adminError
    const [pageFlow, setPageFlow] = useState('login');
    const [adminStats, setAdminStats] = useState(null);

    const handleChange = (event) => {
        if (event.target.name === 'username') { setName(event.target.value) }
        if (event.target.name === 'password') { setPassword(event.target.value) }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitObject = {
            username: user,
            password: pass
        }
        console.log('handle submit called');
        console.log(submitObject);
        async function fetchData() {
            if (isAdmin) {
                const host = `https://wordle.itsvicly.com/`;
                const endpoint = `/1/users/admin/login`;
                const URL = host + endpoint;

                const response = await fetch(`${URL}/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(submitObject),

                    })
                try {
                    // console.log(response);
                    const data = await response.json();
                    setAdminStats(data);
                    setPageFlow('adminStats');
                } catch {
                    console.log('error');
                    setPageFlow('adminError');
                }
                
                
            }
        }
        fetchData();
    }
    
    return (
        pageFlow === 'login' || pageFlow ==='adminError' ?
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
    isAdmin: PropTypes.bool,
    submitTxt: PropTypes.string,
}

export default Form;