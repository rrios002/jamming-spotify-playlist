import React from 'react';
import * as styles from "./Button.module.css";


function Button(props){
    return <button value={props.value} trackobj={props.trackobj} onClick={props.onClick} className={styles.buttonAll}>{props.text}</button>
};

export default Button;