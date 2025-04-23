import React from 'react';


function Button(props){
    return <button value={props.value} onClick={props.onClick}>{props.text}</button>
};

export default Button;