import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import PropTypes from 'prop-types';

const LoginPage = ({ postLoginHandler }) => {
    const loginBtnTxt = 'Login to Existing Account';
    const signupBtnTxt = 'Signup for New Account';
    const backBtnTxt = 'Back';
    //Login, Signup
    const [loginOrSignup, setLoginOrSignup] = useState('Default');

    const loginHandler = () => {
        setLoginOrSignup('Login');
    }

    const signupHandler = () => {
        setLoginOrSignup('Signup');
    }
    
    const setPageToDefault = () => {
        setLoginOrSignup('Default');
    }

    return (
        loginOrSignup === 'Login' ?
            <>
                <Form titleTxt={loginBtnTxt} formType={'login'} submitTxt='Login' postLoginHandler={postLoginHandler} />
                <Button btnText={backBtnTxt} clickHandler={setPageToDefault} />
                
            </>
        : loginOrSignup === 'Signup' ?
            <>
                <Form titleTxt={signupBtnTxt} formType={'signup'} submitTxt='Signup' postLoginHandler={postLoginHandler} />
                <Button btnText={backBtnTxt} clickHandler={setPageToDefault} />
            </>
        : 
            <div>
                <Button btnText={loginBtnTxt} clickHandler={loginHandler} />
                <Button btnText={signupBtnTxt} clickHandler={signupHandler} /> 
            </div>
    );
}

LoginPage.propTypes = {
    postLoginHandler: PropTypes.func
}

export default LoginPage;