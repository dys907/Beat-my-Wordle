import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';

const LoginPage = () => {
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
    
    const backBtnHandler = () => {
        setLoginOrSignup('Default');
    }

    return (
        loginOrSignup === 'Login' ?
            <>
                <Form titleTxt={loginBtnTxt} isAdmin={false} submitTxt='Login' />
                <Button btnText={backBtnTxt} clickHandler={backBtnHandler} />
                
            </>
        : loginOrSignup === 'Signup' ?
            <>
                <Form titleTxt={signupBtnTxt} isAdmin={false} submitTxt='Signup' />
                <Button btnText={backBtnTxt} clickHandler={backBtnHandler} />
            </>
        : 
            <div>
                <Button btnText={loginBtnTxt} clickHandler={loginHandler} />
                <Button btnText={signupBtnTxt} clickHandler={signupHandler} /> 
            </div>
    );
}

export default LoginPage;