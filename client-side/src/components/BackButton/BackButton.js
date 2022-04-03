import React from 'react';
import styles from './BackButton.module.css';
import PropTypes from 'prop-types';

const BackButton = (Props) => {
    const altText = 'Back Button';
    const backBtnImage = 'back-button.png';
    const backBtnWhite = 'backbtnW.png';
    return (
        <button 
        className={styles.backButton} 
        onClick={() => {
            Props.clickHandler();
        }}>
            <img className={styles.backImg} src={backBtnWhite} alt={altText} />
        </button>
    );
}

BackButton.propTypes = {
    clickHandler: PropTypes.func
}

export default BackButton;