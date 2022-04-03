import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';
import Form from '../../components/Form/Form';
import {
    loginBtnTxt,
    signupBtnTxt,
} from './strings';
import styles from './LoginPage.module.css';
import PropTypes from 'prop-types';

const LoginPage = ({ postLoginHandler, homeHandler }) => {
    //Login, Signup
    const [loginOrSignup, setLoginOrSignup] = useState('Default');

    const loginHandler = () => {
        setLoginOrSignup('Login');
    }

    const signupHandler = () => {
        setLoginOrSignup('Signup');
    }
    
    return (
        loginOrSignup === 'Login' ?
        <>
            <div className={styles.backButton}>
                <BackButton  clickHandler={homeHandler} />
            </div>
            <div className={styles.form_div}>
                <Form 
                    titleTxt={loginBtnTxt} 
                    formType={'login'} 
                    submitTxt='Login' 
                    postLoginHandler={postLoginHandler} 
                />                
            </div>
        </>
        : loginOrSignup === 'Signup' ?
        <>    
            <div className={styles.backButton}>
                <BackButton  clickHandler={homeHandler} />
            </div>
            <div className={styles.form_div}>
                <Form 
                    titleTxt={signupBtnTxt} 
                    formType={'signup'} 
                    submitTxt='Signup' 
                    postLoginHandler={postLoginHandler} 
                />
            </div>
        </>
        : 
            <div className={styles.buttonMenu}>
                <Button btnText={loginBtnTxt} clickHandler={loginHandler} />
                <Button btnText={signupBtnTxt} clickHandler={signupHandler} /> 
            </div>
    );
}

LoginPage.propTypes = {
    postLoginHandler: PropTypes.func,
    homeHandler: PropTypes.func
}

export default LoginPage;