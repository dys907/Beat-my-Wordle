import React from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

const Homepage = ({ isLoggedIn, loginHandler, playBtnHandler, uploadHanlder }) => {
    const loginBtnTxt = 'Login';

    return (
        <>
            <h1>Beat my Wordle</h1>
            {isLoggedIn ? <></> : <Button btnText={loginBtnTxt} clickHandler={loginHandler} />}

            {/* Temporary for testing, so we can access Game directly */}
            <Button btnText='Play!' clickHandler={playBtnHandler} />

            <Button btnText='Upload' clickHandler={uploadHanlder} />
        </>
    );
}

Homepage.propTypes = {
    isLoggedIn: PropTypes.bool,
    loginHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
}

export default Homepage;