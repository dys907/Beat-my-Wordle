import React from 'react';
import styles from './BackButton.module.css';
import PropTypes from 'prop-types';
import { altText } from './strings';

const BackButton = (Props) => {
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