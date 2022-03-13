import React from 'react';
import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Button = ({ btnText, clickHandler }) => {    
    return (
        <button 
        className={styles.defaultButton} 
        onClick={() => {
            clickHandler();
        }}>
            {btnText}
        </button>
    );
};

Button.propTypes = {
    btnText: PropTypes.string,
    clickHandler: PropTypes.func
}

export default Button;