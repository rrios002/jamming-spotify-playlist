//Track
import React, { useState, useEffect } from 'react';
import Button from "../Button/Button.js";
import * as styles from "./Track.module.css";

function Track(props){

    if (Array.isArray(props.playlist)){
        console.log("Is an array!");
    } else {
        console.log("is not an array");
    };

    const objectList = props.playlist.map((track) =>{
            
            return (<li key={track.id}>
                <div className={styles.trackContainer}>
                    <div className={styles.imageContainer}>
                        <img src={track.img} className={styles.image} />
                    </div>
                    <div className={styles.trackInfo}>
                        <p>{track.name}</p>
                        <p>{track.artist}</p>
                        <p>{track.album}</p>
                    </div>
                    <Button text={props.text} value={track.id} onClick={props.onClick} />
                </div>
            </li>)
        });
        
        console.log(objectList);
        return <ul>{objectList}</ul>;
    
    
    };
    

    

export default Track;