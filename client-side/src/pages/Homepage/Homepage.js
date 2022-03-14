import React from 'react';
import Button from '../../components/Button/Button';
import PropTypes from 'prop-types';

const Homepage = ({ loginHandler, playBtnHandler, uploadHanlder }) => {
    const loginBtnTxt = 'Login';

    return (
        <>
            <h1>Beat my Wordle</h1>
            <Button btnText={loginBtnTxt} clickHandler={loginHandler} />

            {/* Temporary for testing, so we can access Game directly */}
            <Button btnText='Play!' clickHandler={playBtnHandler} />

            <Button btnText='Upload' clickHandler={uploadHanlder} />
        </>
    );
}

Homepage.propTypes = {
    pageFlow: PropTypes.string,
    loginHandler: PropTypes.func,
    playBtnHandler: PropTypes.func,
}

export default Homepage;